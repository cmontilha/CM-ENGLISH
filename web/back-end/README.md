# CM English - Back-end

Estrutura inicial do back-end usando Supabase. Por enquanto esta pasta guarda a configuracao do projeto e sera expandida com funcoes, migrations e regras de acesso.

## Hierarquia de usuarios

- Admin Master (criador): acesso total, painel administrativo e configuracoes globais.
- Tutor: acesso administrativo limitado ao proprio universo (turmas, alunos, conteudos).
- Aluno: acesso apenas ao consumo de conteudo e participacao em turmas.

Essa hierarquia deve ser implementada no banco com RLS e em regras de autorizacao na aplicacao.

## O que existe hoje

- `supabase/config.toml` - configuracoes do projeto local
- `supabase/migrations/20260101000000_init_platform.sql` - migration inicial com schema, RLS, policies e trigger de `profiles`

## Como rodar (local)

Requer Supabase CLI instalado.

```sh
supabase start
```

Para verificar o status:

```sh
supabase status
```

## Banco de dados e migrations

- Migrations ficam em `web/back-end/supabase/migrations/`
- Para aplicar no projeto Supabase web, use `supabase link` + `supabase db push`

## Aplicar no Supabase web (cloud)

1. Faça login no CLI:

```sh
supabase login
```

2. Link este diretório ao seu projeto cloud (substitua pelo Project Reference do seu projeto):

```sh
supabase link --project-ref <SEU_PROJECT_REF>
```

3. Aplique as migrations no banco remoto:

```sh
supabase db push
```

4. Se quiser validar o histórico aplicado:

```sh
supabase migration list
```

## Modelo de dados (proposta inicial)

Tabelas principais:
- `profiles`: dados base do usuario, role e status.
- `roles`: Admin Master, Tutor, Aluno.
- `permissions`: permissoes de alto nivel (feature flags, admin areas).
- `role_permissions`: mapeamento role x permissions.
- `features`: modulos/recursos do sistema (ativar/desativar em tempo real).
- `user_feature_flags`: overrides por usuario (opcional).
- `classes`: turmas/salas (tutor).
- `class_members`: alunos por turma.
- `contents`: conteudos oficiais da plataforma.
- `tutor_contents`: conteudos publicados por tutores.
- `messages` e `notifications`: comunicacao tutor-aluno.
- `progress`: progresso do aluno (lições, xp, streak).

## Autenticacao e autorizacao (Supabase)

- Usar Supabase Auth para login.
- `profiles` deve referenciar `auth.users` (1:1).
- RLS deve garantir:
  - Admin Master: leitura/escrita global.
  - Tutor: acesso somente aos alunos e turmas vinculadas.
  - Aluno: leitura do proprio perfil e progresso, e conteudos liberados.

## Multiplos contextos de uso

- Aluno pode usar a plataforma sem tutor.
- Aluno pode ser vinculado a uma ou mais turmas de um tutor.
- Conteudos oficiais ficam acessiveis a todos; conteudos de tutor ficam limitados as turmas vinculadas.

## Stack

- Supabase (Postgres + Auth)
