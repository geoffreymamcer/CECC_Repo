import React from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";

export const MapSection = () => {
  const address =
    "2nd Floor APC Building CKCI Dialysis Center Brgy, Candelaria, 4323 Quezon";
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    "APC Building CKCI Dialysis Center Candelaria Quezon"
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="location" className="py-24 bg-slate-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <h2 className="text-deep-red font-semibold text-sm tracking-widest uppercase mb-2">
              Visit Us
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 font-serif">
              Our Location
            </h3>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Conveniently located in Candelaria, providing accessible eye care
              for the entire community.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-red-100 flex flex-col lg:flex-row h-auto lg:h-[500px]">
          {/* Info Side */}
          <div className="p-10 lg:p-12 lg:w-1/3 flex flex-col justify-center bg-white relative z-10">
            <div className="space-y-8">
              <FadeInWhenVisible delay={100}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 text-deep-red">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Address
                    </h4>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      2nd Floor APC Building CKCI Dialysis Center
                      <br />
                      Brgy. Masin Sur, Candelaria, Quezon Province, Philippines
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={200}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 text-deep-red">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Clinic Hours
                    </h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li className="flex justify-between w-40">
                        <span>Mon-Sat: 9:00 PM-5:30 PM</span>
                      </li>
                      <li className="flex justify-between w-40">
                        <span>Sunday:</span> <span>Closed</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </FadeInWhenVisible>

              <FadeInWhenVisible delay={300}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 text-deep-red">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Contact
                    </h4>
                    <p className="text-slate-600 text-sm">(555) 123-4567</p>
                    <p className="text-slate-600 text-sm">
                      info@candelariavision.com
                    </p>
                  </div>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:w-2/3 h-full min-h-[400px] relative bg-slate-200">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={mapUrl}
              title="Clinic Location Map"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>

            <div className="absolute inset-0 pointer-events-none shadow-inner border-l border-red-100/50 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
