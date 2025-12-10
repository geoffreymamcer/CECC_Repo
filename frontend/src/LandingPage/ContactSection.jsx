import React from "react";
import { FadeInWhenVisible } from "./FadeInWhenVisible";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeInWhenVisible>
            <div>
              <h2 className="text-deep-red font-semibold text-sm tracking-widest uppercase mb-2">
                Get in Touch
              </h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 font-serif">
                Book Your Appointment
              </h3>
              <p className="text-slate-600 mb-8 text-lg">
                Ready to see the world more clearly? Fill out the form, and our
                team will get back to you within 24 hours to confirm your visit.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 text-deep-red group-hover:bg-deep-red group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Visit Us</h4>
                    <p className="text-slate-500">
                      123 Visionary Way, Suite 400
                      <br />
                      Metropolis, NY 10012
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center shrink-0 text-deep-red group-hover:bg-deep-red group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Call Us</h4>
                    <p className="text-slate-500">(555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={200} animationClass="animate-fadeInUp">
            <form
              className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent transition-all bg-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent transition-all bg-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent transition-all bg-white"
                  placeholder="john@example.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent transition-all bg-white"
                  placeholder="(555) 000-0000"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-red-200 focus:outline-none focus:ring-2 focus:ring-deep-red focus:border-transparent transition-all bg-white"
                  placeholder="Tell us about your needs..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-deep-red text-white font-bold rounded-lg hover:bg-dark-red transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Request Appointment
              </button>
            </form>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
};
