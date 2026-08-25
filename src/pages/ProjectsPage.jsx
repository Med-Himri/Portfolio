import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/content";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="py-32">
        <div className="container mx-auto px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back home
          </Link>
          <br />
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            All Work
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Every project,
            <span className="font-serif italic font-normal text-white">
              {" "}
              start to finish.
            </span>
          </h1>

          {loading && (
            <p className="text-muted-foreground mt-12">Loading projects...</p>
          )}

          {!loading && projects.length === 0 && (
            <p className="text-muted-foreground mt-12">No projects yet.</p>
          )}

          {!loading && projects.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {projects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} delay={(idx + 1) * 100} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
