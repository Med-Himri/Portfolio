const workItems = [
  {
    period: "2026 — Present",
    role: "Junior Data Scientist",
    company: "Freelance / Upwork",
    description:
      "Building a freelance data analysis practice — cleaning datasets, building dashboards, and applying ML to real business questions for clients.",
    technologies: ["Python", "SQL", "Power BI", "Pandas"],
    current: true,
  },
];

const formationItems = [
  {
    period: "2026",
    role: "Attendify — Final Project (PFE)",
    company: "SUP MTI Rabat",
    description:
      "Built a multi-tenant school attendance SaaS end-to-end: session management, parent alerts, an AI chatbot, and a Random Forest model predicting absence risk.",
    technologies: ["Next.js", "Supabase", "FastAPI", "Random Forest"],
    current: false,
  },
  {
    period: "2025",
    role: "Plant Disease Detection — Computer Vision",
    company: "SUP MTI Rabat (Year 1 Project)",
    description:
      "Built a U-Net based image segmentation model to detect diseases on plant leaves, my first hands-on deep learning project — from data preprocessing to model evaluation.",
    technologies: ["Python", "U-Net", "Computer Vision", "Deep Learning"],
    current: false,
  },
  {
    period: "2024 — 2026",
    role: "Master's in Data Science",
    company: "SUP MTI Rabat, Morocco",
    description:
      "Graduate studies covering statistics, machine learning, and data engineering, capped by the Attendify project above.",
    technologies: ["Python", "ML", "Statistics", "SQL"],
    current: false,
  },
];

const Track = ({ title, items }) => (
  <div>
    <h3 className="text-sm font-medium tracking-wider uppercase text-primary mb-8">
      {title}
    </h3>
    <div className="relative pl-8">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/70 via-primary/30 to-transparent shadow-[0_0_20px_rgba(255,106,77,0.5)]" />

      <div className="space-y-8">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="relative animate-fade-in"
            style={{ animationDelay: `${(idx + 1) * 150}ms` }}
          >
            <div className="absolute -left-8 top-1.5 w-3 h-3 bg-primary rounded-full -translate-x-1/2 ring-4 ring-background z-10">
              {item.current && (
                <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
              )}
            </div>

            <div className="glass p-6 rounded-2xl border border-primary/30 hover:border-primary/50 transition-all duration-500">
              <span className="text-sm text-primary font-medium">
                {item.period}
              </span>
              <h4 className="text-lg font-semibold mt-2">{item.role}</h4>
              <p className="text-muted-foreground text-sm">{item.company}</p>
              <p className="text-sm text-muted-foreground mt-4">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {item.technologies.map((tech, techIdx) => (
                  <span
                    key={techIdx}
                    className="px-3 py-1 bg-surface text-xs rounded-full text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Experience = () => {
  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/4 w-96
       h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span
            className="text-secondary-foreground text-sm
           font-medium tracking-wider uppercase animate-fade-in"
          >
            Career Journey
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold
           mt-4 mb-6 animate-fade-in animation-delay-100
            text-secondary-foreground"
          >
            A path built on{" "}
            <span className="font-serif italic font-normal text-white">
              {" "}
              real projects.
            </span>
          </h2>

          <p
            className="text-muted-foreground
           animate-fade-in animation-delay-200"
          >
            From a Master's in Data Science to building full ML pipelines,
            here's how I got here — and where I'm headed next.
          </p>
        </div>

        {/* Two tracks, side by side */}
        <div className="grid md:grid-cols-2 gap-12">
          <Track title="Work" items={workItems} />
          <Track title="Formations" items={formationItems} />
        </div>
      </div>
    </section>
  );
};
