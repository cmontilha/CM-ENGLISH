import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";

interface ClassRow {
  id: string;
  title: string;
  description: string | null;
  created_at: string | null;
}

interface ClassMemberRow {
  id: string;
  class_id: string;
  student_id: string;
  profile: {
    full_name: string | null;
    email: string | null;
  } | null;
}

const TutorClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [members, setMembers] = useState<Record<string, ClassMemberRow[]>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emailToAdd, setEmailToAdd] = useState<Record<string, string>>({});

  const loadClasses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("classes")
      .select("id, title, description, created_at")
      .eq("tutor_id", user.id)
      .order("created_at", { ascending: false });

    setClasses(data ?? []);
  };

  const loadMembers = async (classId: string) => {
    const { data } = await supabase
      .from("class_members")
      .select("id, class_id, student_id, profile:profiles(full_name, email)")
      .eq("class_id", classId);

    setMembers((prev) => ({ ...prev, [classId]: (data as ClassMemberRow[]) ?? [] }));
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  useEffect(() => {
    classes.forEach((item) => loadMembers(item.id));
  }, [classes]);

  const handleCreateClass = async () => {
    if (!user || !title.trim()) return;

    await supabase.from("classes").insert({
      tutor_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
    });

    setTitle("");
    setDescription("");
    loadClasses();
  };

  const handleAddStudent = async (classId: string) => {
    const email = (emailToAdd[classId] || "").trim();
    if (!email) return;

    const { data } = await supabase.rpc("find_student_by_email", { email_input: email });
    const student = Array.isArray(data) ? data[0] : data;

    if (!student?.id) return;

    await supabase.from("class_members").insert({
      class_id: classId,
      student_id: student.id,
    });

    setEmailToAdd((prev) => ({ ...prev, [classId]: "" }));
    loadMembers(classId);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />

      <main className="container mx-auto px-4 pt-20 md:pt-24 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Turmas e salas
          </h1>
          <p className="text-muted-foreground">
            Crie turmas, organize alunos e envie conteudos.
          </p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <Input
              placeholder="Nome da turma"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Input
              placeholder="Descricao curta"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button variant="glow" onClick={handleCreateClass}>
              Criar turma
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {classes.length === 0 ? (
            <div className="glass-card p-6">
              <p className="text-muted-foreground">Nenhuma turma criada.</p>
            </div>
          ) : (
            classes.map((item) => (
              <div key={item.id} className="glass-card p-6 space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-lg">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {item.description || "Sem descricao"}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    placeholder="Email do aluno"
                    value={emailToAdd[item.id] || ""}
                    onChange={(event) =>
                      setEmailToAdd((prev) => ({ ...prev, [item.id]: event.target.value }))
                    }
                  />
                  <Button variant="outline" onClick={() => handleAddStudent(item.id)}>
                    Adicionar aluno
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  {(members[item.id] || []).length === 0 ? (
                    <p className="text-muted-foreground">Nenhum aluno nesta turma.</p>
                  ) : (
                    (members[item.id] || []).map((member) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">
                            {member.profile?.full_name || "Aluno"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.profile?.email}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default TutorClasses;
