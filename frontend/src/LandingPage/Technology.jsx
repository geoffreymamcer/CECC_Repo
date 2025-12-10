import React from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";

export const Technology = () => {
  return (
    <section id="technology" className="py-24 bg-slate-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-deep-red to-dark-red text-white flex flex-col lg:flex-row">
          <div className="flex-1 p-10 lg:p-16 flex flex-col justify-center">
            <FadeInWhenVisible>
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
                <span className="text-white/90 text-xs font-bold tracking-wider uppercase">
                  Advanced Technology
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                Precision Diagnostics with OCT Scanning
              </h3>
              <p className="text-red-100 text-lg mb-8 leading-relaxed">
                Our clinic is equipped with Optical Coherence Tomography (OCT),
                allowing us to see beneath the surface of your retina. This
                technology is crucial for the early detection of glaucoma,
                macular degeneration, and diabetic eye disease often before
                symptoms appear.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Ultra-widefield Retinal Imaging",
                  "Corneal Topography",
                  "Digital Phoropter Refraction",
                  "Non-contact Tonometry",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <button className="self-start px-8 py-3 bg-white text-deep-red font-semibold rounded-full hover:bg-slate-100 transition-colors shadow-lg">
                Explore Technology
              </button>
            </FadeInWhenVisible>
          </div>

          <div className="flex-1 relative min-h-[400px] lg:min-h-0">
            <img
              src="https://picsum.photos/seed/tech/800/600"
              alt="Advanced Eye Scan Technology"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 lg:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-red/80 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-deep-red/40"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
