// import { Database, LineChart, Users, Brain } from "lucide-react";

// const highlights = [
//   {
//     icon: Database,
//     title: "Clean Data",
//     description:
//       "Turning messy, unstructured exports into reliable, analysis-ready datasets.",
//   },
//   {
//     icon: LineChart,
//     title: "Clear Insights",
//     description:
//       "Building dashboards and visuals that make the data easy to act on.",
//   },
//   {
//     icon: Users,
//     title: "Communication",
//     description: "Explaining findings in plain language, not just numbers.",
//   },
//   {
//     icon: Brain,
//     title: "Continuous Learning",
//     description:
//       "Always sharpening SQL, ML, and analysis skills on real-world problems.",
//   },
// ];

// export const About = () => {
//   return (
//     <section id="about" className="py-32 relative overflow-hidden">
//       <div className="container mx-auto px-6 relative z-10">
//         <div className="grid lg:grid-cols-2 gap-16 items-center">
//           {/* Left Column */}
//           <div className="space-y-8">
//             <div className="animate-fade-in">
//               <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
//                 About Me
//               </span>
//             </div>

//             <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
//               Data is only useful
//               <span className="font-serif italic font-normal text-white">
//                 {" "}
//                 when someone can act on it.
//               </span>
//             </h2>

//             <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
//               <p>
//                 I'm a data analyst and ML practitioner based in Morocco, with
//                 a Master's in Data Science and hands-on experience turning
//                 messy, real-world data into dashboards and predictions people
//                 actually use.
//               </p>
//               <p>
//                 I work across the full pipeline cleaning raw data in
//                 Python/Pandas, querying and modeling it in SQL, and
//                 presenting it in Power BI or a custom dashboard. When the
//                 problem calls for it, I build predictive models too, like the
//                 absence-risk system in my Attendify project.
//               </p>
//               <p>
//                 Outside of client work, I'm always sharpening my SQL and
//                 machine learning skills, and building small tools that turn
//                 raw data into something readable in minutes instead of hours.
//               </p>
//             </div>
//           </div>

//           {/* Right Column - Hilights */}
//           <div className="grid sm:grid-cols-2 gap-6">
//             {highlights.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="glass p-6 rounded-2xl animate-fade-in"
//                 style={{ animationDelay: `${(idx + 1) * 100}ms` }}
//               >
//                 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
//                   <item.icon className="w-6 h-6 text-primary" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
//                 <p className="text-sm text-muted-foreground">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };


import { Code2, Layers, Users, Brain } from "lucide-react";

const highlights = [
  {
    icon: Code2,
    title: "Full-Stack Builds",
    description:
      "Shipping complete applications from database to UI, not just isolated features.",
  },
  {
    icon: Layers,
    title: "Solid Architecture",
    description:
      "Designing systems that stay clean and maintainable as they grow.",
  },
  {
    icon: Users,
    title: "Communication",
    description: "Explaining technical decisions in plain language, not just code.",
  },
  {
    icon: Brain,
    title: "Continuous Learning",
    description:
      "Always sharpening my stack and analytical skills on real-world problems.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="animate-fade-in">
              <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase">
                About Me
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight animate-fade-in animation-delay-100 text-secondary-foreground">
              Code is only useful
              <span className="font-serif italic font-normal text-white">
                {" "}
                when it ships and works.
              </span>
            </h2>

            <div className="space-y-4 text-muted-foreground animate-fade-in animation-delay-200">
              <p>
                I'm a full-stack developer based in Morocco, with a Master's
                in Data Science and hands-on experience building complete
                web applications people actually use.
              </p>
              <p>
                I work across the full stack — React and Next.js on the
                frontend, Node.js and Express on the backend, and MongoDB or
                PostgreSQL/Supabase for data. I handle architecture, auth,
                and deployment, not just individual features. When a project
                calls for it, I also bring analytical depth, like the
                absence-risk prediction system in my Attendefy project.
              </p>
              <p>
                Outside of client work, I'm always sharpening my stack and
                building small tools that turn raw ideas into working
                products in days instead of weeks.
              </p>
            </div>
          </div>

          {/* Right Column - Hilights */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="glass p-6 rounded-2xl animate-fade-in"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 hover:bg-primary/20">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};