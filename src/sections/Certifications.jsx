import { useEffect, useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { getCertifications } from "@/lib/content";

const fallbackCertifications = [
  {
    id: "fallback-1",
    title: "Data Analytics Certificate",
    issuer: "ALX Africa",
    issued_date: "2025",
    credential_url: "#",
  },
];

export const Certifications = () => {
  const [certifications, setCertifications] = useState(fallbackCertifications);

  useEffect(() => {
    getCertifications().then((data) => {
      if (data.length > 0) setCertifications(data);
    });
  }, []);

  return (
    <section id="certifications" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Certifications
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-secondary-foreground">
            Formal training,
            <span className="font-serif italic font-normal text-white">
              {" "}
              verified.
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => {
            const hasLink = cert.credential_url && cert.credential_url !== "#";
            const Wrapper = hasLink ? "a" : "div";
            const wrapperProps = hasLink
              ? {
                  href: cert.credential_url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <Wrapper
                key={cert.id}
                {...wrapperProps}
                className="glass p-6 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all duration-300 animate-fade-in group"
                style={{ animationDelay: `${(idx + 1) * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  {hasLink && (
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                {cert.issued_date && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {cert.issued_date}
                  </p>
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};
