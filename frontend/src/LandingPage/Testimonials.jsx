import React from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";

const TESTIMONIALS = [
  {
    id: 1,
    text: "The level of care I received was exceptional. Dr. Mitchell explained everything clearly and the technology they use is incredibly impressive.",
  },
  {
    id: 2,
    text: "I've been bringing my children here for years. The staff is wonderful with kids, making what could be a scary experience into a fun visit.",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Red Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-deep-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <h2 className="text-deep-red font-semibold text-sm tracking-widest uppercase mb-2">
              Patient Stories
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              What Our Patients Say
            </h3>
            <div className="w-24 h-1 bg-deep-red mx-auto rounded-full opacity-20"></div>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, index) => (
            <FadeInWhenVisible key={t.id} delay={index * 100}>
              <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-lg border border-red-100 relative transform transition-transform hover:-translate-y-1 duration-300 group hover:shadow-red-900/5">
                <div className="absolute top-6 left-8 text-deep-red/10 font-serif text-8xl leading-none group-hover:text-deep-red/20 transition-colors">
                  "
                </div>
                <p className="relative z-10 text-slate-700 font-serif text-lg italic leading-relaxed mb-8">
                  {t.text}
                </p>
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};
