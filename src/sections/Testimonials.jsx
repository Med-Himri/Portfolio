import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";

const principles = [
  {
    quote:
      "I'd rather spend an extra hour cleaning data than five minutes explaining why a chart is wrong.",
    label: "On messy data",
  },
  {
    quote:
      "A dashboard only matters if the person reading it can act on it in under a minute.",
    label: "On communication",
  },
  {
    quote:
      "I treat every small freelance project like a real client relationship — clear scope, clear delivery, no surprises.",
    label: "On working with clients",
  },
  {
    quote:
      "I'm early in my career, and I stay that way on purpose — always picking up the next SQL pattern or ML technique on real problems, not just tutorials.",
    label: "On growth",
  },
];

export const Testimonials = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const next = () => {
    setActiveIdx((prev) => (prev + 1) % principles.length);
  };

  const previous = () => {
    setActiveIdx((prev) => (prev - 1 + principles.length) % principles.length);
  };

  return (
    <section id="approach" className="py-32 relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2
       w-[800px] h-[800px] bg-primary/5
        rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
      />
      <div
        className="container mx-auto 
      px-6 relative z-10"
      >
        {/* Section Header */}
        <div
          className="text-center max-w-3xl 
        mx-auto mb-16"
        >
          <span
            className="text-secondary-foreground 
          text-sm font-medium tracking-wider 
          uppercase animate-fade-in"
          >
            How I Work
          </span>
          <h2
            className="text-4xl md:text-5xl 
          font-bold mt-4 mb-6 animate-fade-in 
          animation-delay-100 text-secondary-foreground"
          >
            A few things{" "}
            <span
              className="font-serif italic 
            font-normal text-white"
            >
              I hold myself to.
            </span>
          </h2>
        </div>

        {/* Principle Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Card */}
            <div className="glass p-8 rounded-3xl md:p-12 glow-border animate-fade-in animation-delay-200">
              <div className="absolute -top-4 left-8 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>

              <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 pt-4">
                "{principles[activeIdx].quote}"
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 ring-2 ring-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">M</span>
                </div>
                <div>
                  <div className="font-semibold">Mohamed</div>
                  <div className="text-sm text-muted-foreground">
                    {principles[activeIdx].label}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                className="p-3 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
                onClick={previous}
              >
                <ChevronLeft />
              </button>

              <div className="flex gap-2">
                {principles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === activeIdx
                        ? "w-8 bg-primary"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="p-3 rounded-full glass hover:bg-primary/10 hover:text-primary transition-all"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
