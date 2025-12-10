import React from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";
import doctor1 from "./images/doctor1.jpg";
import doctor2 from "./images/doctor2.jpg";

const DOCTORS = [
  {
    id: 1,
    imageUrl: doctor1,
  },
  {
    id: 2,
    imageUrl: doctor2,
  },
];

export const Doctors = () => {
  return (
    <section id="doctors" className="py-24 bg-red-50/50">
      <div className="max-w-screen-xl mx-auto px-4">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Meet Our Team
            </h3>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Our doctors are dedicated professionals, providing compassionate
              care with a commitment to excellence.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* 
           CHANGE 1: Replaced Grid with Flexbox + justify-center 
           This ensures the cards are centered regardless of how many there are.
        */}
        <div className="flex flex-wrap justify-center gap-10">
          {DOCTORS.map((doc, index) => (
            <FadeInWhenVisible key={doc.id} delay={index * 150}>
              {/* 
                 CHANGE 2: Added 'w-full max-w-lg' 
                 This makes the card wider (max-w-lg is roughly 32rem/512px). 
                 You can change max-w-lg to max-w-xl if you want them even bigger.
              */}
              <div className="w-full max-w-lg bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-xl hover:shadow-red-900/5 transition-all duration-300 overflow-hidden">
                {/* 
                   CHANGE 3: Changed 'h-80 object-cover' to 'h-auto'
                   'h-auto' allows the image to scale naturally so text isn't cut off.
                */}
                <img
                  src={doc.imageUrl}
                  alt={`Doctor ${doc.id}`}
                  className="w-full h-auto transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
};
