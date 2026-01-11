import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

const AdminCourses = () => {
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const loadCourses = async () => {
    const { data } = await supabase
      .from("courses")
      .select("id, title, description, is_active, created_at")
      .order("created_at", { ascending: false });
    setCourses(data ?? []);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleCreateCourse = async () => {
    if (!title.trim()) return;

    await supabase.from("courses").insert({
      title: title.trim(),
      description: description.trim() || null,
    });

    setTitle("");
    setDescription("");
    loadCourses();
  };

  const handleToggleCourse = async (course: CourseRow) => {
    await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);

    loadCourses();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Cursos</h1>
        <p className="text-muted-foreground">
          Crie e monitore cursos disponiveis na plataforma.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <Input
            placeholder="Titulo do curso"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Input
            placeholder="Descricao curta"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Button variant="glow" onClick={handleCreateCourse}>
            Criar curso
          </Button>
        </div>
      </div>

      <div className="glass-card p-6">
        {courses.length === 0 ? (
          <p className="text-muted-foreground">Nenhum curso cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-border/40 pb-4"
              >
                <div>
                  <p className="font-medium text-foreground">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.description || "Sem descricao"}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-wider text-muted-foreground">
                  <span>{course.is_active ? "Ativo" : "Inativo"}</span>
                </div>
                <Button variant="outline" onClick={() => handleToggleCourse(course)}>
                  {course.is_active ? "Desativar" : "Ativar"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
