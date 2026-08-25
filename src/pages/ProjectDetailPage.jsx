import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { Navbar } from "@/layout/Navbar";
import { Footer } from "@/layout/Footer";
import { getProjectById } from "@/lib/content";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getProjectById(id).then((data) => {
      if (!cancelled) {
        setProject(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <main className="py-32">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            All projects
          </Link>

          {loading && (
            <p className="text-muted-foreground">Loading project...</p>
          )}

          {!loading && !project && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Project not found</h1>
              <p className="text-muted-foreground mb-8">
                This project may have been removed or the link is incorrect.
              </p>
              <Link
                to="/projects"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Back to all projects <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {project && (
            <>
              <div className="relative overflow-hidden aspect-video rounded-2xl mb-10 glass">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-secondary-foreground">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 rounded-full bg-surface text-xs font-medium border border-border/50 text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-4">
                {project.link && project.link !== "#" && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                  >
                    View live <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {project.github && project.github !== "#" && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors"
                  >
                    <Github className="w-4 h-4" /> View code
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
