import React, { useRef } from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";

const SERVICES = [
  {
    id: 1,
    title: "Comprehensive & Computerized Eye Examinations",
    description:
      "Thorough assessment of your vision and eye health using the latest computerized technology for accurate prescriptions and early detection of eye conditions.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Fundus Photos & Retinal Imaging",
    description:
      "Advanced imaging of your retina, optic nerve, and blood vessels to screen for and monitor eye diseases with high precision.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Color Vision & Cataract Screening",
    description:
      "Specialized tests to screen for color vision deficiencies and the early signs of cataracts to safeguard your long-term vision.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Headache & Dry Eye Management",
    description:
      "Specialized care to diagnose and treat the root causes of vision-related headaches and provide lasting relief from dry eye symptoms.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Complete Eyewear Choices",
    description:
      "A wide selection of stylish and durable frames and high-quality lenses for adults and kids to suit every lifestyle, prescription, and budget.",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export const Services = () => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 350; // Card width + gap
      const currentScroll = current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
      current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="services" className="py-24 bg-white relative">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <FadeInWhenVisible className="max-w-2xl w-full">
            <div>
              <h2 className="text-deep-red font-semibold text-sm tracking-widest uppercase mb-2">
                Our Expertise
              </h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
                Comprehensive Vision Services
              </h3>
              <p className="text-slate-500 text-lg">
                We provide a continuum of care for your eyes, from routine
                checkups to advanced medical treatments.
              </p>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={100} className="flex gap-4 shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-red-100 text-deep-red flex items-center justify-center hover:bg-deep-red hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-red focus:ring-offset-2 bg-red-50"
              aria-label="Scroll left"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-red-100 text-deep-red flex items-center justify-center hover:bg-deep-red hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-deep-red focus:ring-offset-2 bg-red-50"
              aria-label="Scroll right"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </FadeInWhenVisible>
        </div>

        <FadeInWhenVisible delay={200}>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto py-8 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="min-w-[300px] md:min-w-[340px] snap-center group h-auto min-h-[380px] p-8 bg-red-50/50 border border-red-100/50 rounded-2xl shadow-sm transition-all duration-300 ease-out hover:shadow-2xl hover:scale-[1.02] hover:bg-white hover:border-red-200 flex flex-col"
              >
                <div className="w-14 h-14 bg-white text-deep-red rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-deep-red group-hover:text-white shadow-sm border border-red-100">
                  {service.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm flex-grow mb-6">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </FadeInWhenVisible>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};
