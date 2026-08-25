import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github } from "lucide-react";
import { AnimatedBorderButton } from "@/components/AnimatedBorderButton";
import { getProjects } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

// Shown immediately while the real data loads from Supabase, and as a
// fallback if the fetch fails (e.g. env vars not set yet).
const fallbackProjects = [
  {
    id: "fallback-1",
    title: "Attendefy",
    description:
      "A multi-tenant school attendance SaaS with an ML-based absence-risk model flags at-risk students early instead of after the fact, plus an AI chatbot for plain-language questions about the data.",
    image: "/projects/project1.png",
    tags: ["Next.js 14", "Supabase", "Python / FastAPI", "Random Forest"],
    link: "#",
    github: "#",
  },
  {
    id: "fallback-2",
    title: "Data Analysis Assistant",
    description:
      "A CSV-to-dashboard tool: upload any messy CSV and get automated Pandas analysis plus an interactive Chart.js dashboard — no manual setup per dataset.",
    image: "/projects/project2.png",
    tags: ["React / Vite", "FastAPI", "Supabase", "Chart.js", "Pandas"],
    link: "#",
    github: "#",
  },
];
const HOMEPAGE_PROJECT_LIMIT = 2;
export const Projects = () => {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    getProjects().then((data) => {
      if (data.length > 0) setProjects(data);
    });
  }, []);

  const featured = projects.slice(0, HOMEPAGE_PROJECT_LIMIT);
  const hasMore = projects.length > HOMEPAGE_PROJECT_LIMIT;

  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      {/* Bg glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mx-auto max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Projects that
            <span className="font-serif italic font-normal text-white">
              {" "}
              turn data into decisions.
            </span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            A selection of my recent work, from full ML pipelines to tools
            that turn raw CSV exports into something a business can act on.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {featured.map((project, idx) => (
            <ProjectCard key={project.id} project={project} delay={(idx + 1) * 100} />
          ))}
        </div>

        {/* View All CTA */}
        {hasMore && (
          <div className="text-center mt-12 animate-fade-in animation-delay-500">
            <Link to="/projects">
              <AnimatedBorderButton>
                View All Projects
                <ArrowUpRight className="w-5 h-5" />
              </AnimatedBorderButton>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
