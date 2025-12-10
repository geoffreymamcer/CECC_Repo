import React, { useState, useEffect } from "react";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";
import image4 from "./images/image4.png";

const HERO_IMAGES = [image1, image2, image3, image4];

export const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-deep-red to-dark-red"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 transform translate-x-20 hidden lg:block pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-screen-xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fadeInUp font-serif drop-shadow-sm">
            World Class Eye Care <br className="hidden lg:block" />
            Within <span className="text-red-100">Your Reach</span>
          </h1>

          <p
            className="text-lg text-red-50 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-simple-fade-in opacity-0"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            Experience world-class eye care with our state-of-the-art diagnostic
            technology and a team of dedicated specialists committed to your
            ocular health.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-scaleIn opacity-0"
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-deep-red font-bold rounded-full hover:bg-red-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
            >
              Book Appointment
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/30 font-semibold rounded-full hover:bg-white/10 transition-all shadow-sm hover:shadow-md text-center backdrop-blur-sm"
            >
              View Services
            </a>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-white/5 rounded-full opacity-70 blur-3xl" />

          <div
            className="relative rounded-3xl shadow-2xl shadow-black/20 w-full h-auto aspect-[4/5] lg:aspect-square animate-fadeIn transform transition-transform duration-700 hover:scale-[1.01] border-4 border-white/10 overflow-hidden"
            style={{ animationDelay: "0.2s" }}
          >
            {HERO_IMAGES.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Vision Care Slide ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>

          <div
            className="absolute bottom-8 -left-4 lg:-left-8 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-fadeInUp z-20"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-deep-red">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-slate-900">Top Rated Clinic</p>
                <div className="flex text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
