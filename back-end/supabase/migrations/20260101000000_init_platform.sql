-- Core roles
create extension if not exists "pgcrypto";

create table if not exists public.roles (
  name text primary key,
  description text,
  created_at timestamptz default now()
);

insert into public.roles (name, description)
values
  ('admin_master', 'Controle total da plataforma'),
  ('tutor', 'Admin limitado para turmas e conteudos'),
  ('student', 'Aluno com acesso ao conteudo')
on conflict (name) do nothing;

-- Profiles tied to auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  full_name text,
  role text not null references public.roles(name) default 'student',
  is_active boolean default true,
  created_at timestamptz default now(),
  last_login_at timestamptz,
  updated_at timestamptz default now()
);

-- Feature flags (global)
create table if not exists public.features (
  key text primary key,
  label text,
  is_enabled boolean default true,
  updated_at timestamptz default now()
);

insert into public.features (key, label, is_enabled)
values
  ('dashboard', 'Dashboard', true),
  ('courses', 'Trilhas', true),
  ('review', 'Revisao', true),
  ('tutor_tools', 'Ferramentas de tutor', true),
  ('admin_panel', 'Painel administrativo', true)
  on conflict (key) do nothing;

-- Courses and content
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content_type text,
  url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.tutor_contents (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  content_type text,
  url text,
  is_published boolean default false,
  created_at timestamptz default now()
);

-- Classes (Moodle-like)
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.class_members (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  added_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  unique (class_id, student_id)
);

-- Messaging and notifications
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references public.classes(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Progress tracking
create table if not exists public.progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  lessons_completed integer default 0,
  xp integer default 0,
  streak integer default 0,
  updated_at timestamptz default now()
);

-- Helper functions
create or replace function public.is_admin_master()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin_master'
      and is_active = true
  );
$$;

create or replace function public.is_tutor()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'tutor'
      and is_active = true
  );
$$;

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'student'
      and is_active = true
  );
$$;

-- Auto profile creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    case
      when (new.raw_user_meta_data ->> 'role') = 'tutor' then 'tutor'
      else 'student'
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RPC to allow tutor to find students by email
create or replace function public.find_student_by_email(email_input text)
returns table (id uuid, email text, full_name text)
language sql
stable
security definer
as $$
  select p.id, p.email, p.full_name
  from public.profiles p
  where p.email = email_input
    and p.role = 'student'
    and p.is_active = true
    and (public.is_tutor() or public.is_admin_master());
$$;

-- RLS
alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.features enable row level security;
alter table public.courses enable row level security;
alter table public.contents enable row level security;
alter table public.tutor_contents enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.progress enable row level security;

-- Roles
create policy "roles_select_all" on public.roles
  for select using (true);

create policy "roles_admin_all" on public.roles
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

-- Profiles
create policy "profiles_self_select" on public.profiles
  for select using (id = auth.uid());

create policy "profiles_self_update" on public.profiles
  for update using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
    and is_active = (select is_active from public.profiles where id = auth.uid())
  );

create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

create policy "profiles_tutor_class_select" on public.profiles
  for select using (
    public.is_tutor()
    and exists (
      select 1 from public.class_members cm
      join public.classes c on c.id = cm.class_id
      where c.tutor_id = auth.uid()
        and cm.student_id = public.profiles.id
    )
  );

-- Features
create policy "features_select_all" on public.features
  for select using (true);

create policy "features_admin_all" on public.features
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

-- Courses
create policy "courses_select_all" on public.courses
  for select using (true);

create policy "courses_admin_all" on public.courses
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

-- Contents
create policy "contents_select_all" on public.contents
  for select using (true);

create policy "contents_admin_all" on public.contents
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

-- Tutor contents
create policy "tutor_contents_select" on public.tutor_contents
  for select using (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
  );

create policy "tutor_contents_write" on public.tutor_contents
  for all using (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
  )
  with check (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
  );

-- Classes
create policy "classes_select" on public.classes
  for select using (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
    or exists (
      select 1 from public.class_members cm
      where cm.class_id = classes.id
        and cm.student_id = auth.uid()
    )
  );

create policy "classes_write" on public.classes
  for all using (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
  )
  with check (
    public.is_admin_master()
    or (public.is_tutor() and tutor_id = auth.uid())
  );

-- Class members
create policy "class_members_select" on public.class_members
  for select using (
    public.is_admin_master()
    or exists (
      select 1 from public.classes c
      where c.id = class_members.class_id
        and c.tutor_id = auth.uid()
    )
    or class_members.student_id = auth.uid()
  );

create policy "class_members_insert" on public.class_members
  for insert with check (
    public.is_admin_master()
    or exists (
      select 1 from public.classes c
      where c.id = class_members.class_id
        and c.tutor_id = auth.uid()
    )
  );

-- Messages
create policy "messages_select" on public.messages
  for select using (
    public.is_admin_master()
    or exists (
      select 1 from public.classes c
      where c.id = messages.class_id
        and c.tutor_id = auth.uid()
    )
    or exists (
      select 1 from public.class_members cm
      where cm.class_id = messages.class_id
        and cm.student_id = auth.uid()
    )
  );

create policy "messages_insert" on public.messages
  for insert with check (
    public.is_admin_master()
    or exists (
      select 1 from public.classes c
      where c.id = messages.class_id
        and c.tutor_id = auth.uid()
    )
    or exists (
      select 1 from public.class_members cm
      where cm.class_id = messages.class_id
        and cm.student_id = auth.uid()
    )
  );

-- Notifications
create policy "notifications_select" on public.notifications
  for select using (
    public.is_admin_master()
    or user_id = auth.uid()
  );

create policy "notifications_admin" on public.notifications
  for all using (public.is_admin_master())
  with check (public.is_admin_master());

-- Progress
create policy "progress_select" on public.progress
  for select using (
    public.is_admin_master()
    or user_id = auth.uid()
  );

create policy "progress_write" on public.progress
  for all using (
    public.is_admin_master()
    or user_id = auth.uid()
  )
  with check (
    public.is_admin_master()
    or user_id = auth.uid()
  );
