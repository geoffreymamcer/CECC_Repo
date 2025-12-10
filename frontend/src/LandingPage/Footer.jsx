import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./images/CECC.png";

export const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer id="contact" className="bg-dark-red text-white pt-16 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <img src={logo} alt="clinic logo" />
              </div>
              <span className="text-xl font-bold">
                Candelaria Eye Care Clinic
              </span>
            </div>
            <p className="text-red-100 text-sm leading-relaxed mb-6">
              Dedicated to preserving and enhancing your vision through
              compassion, expertise, and advanced technology.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/candelariaeyecareclinic"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-red-100 text-sm">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#doctors"
                  className="hover:text-white transition-colors"
                >
                  Our Doctors
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-red-100 text-sm">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5 text-white/70"
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
                <span>
                  2nd Floor APC Building CKCI Dialysis Center
                  <br />
                  Brgy. Masin Sur, Candelaria, Quezon Province, Philippines
                </span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 shrink-0 text-white/70"
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
                <span>0915-506-7871</span>
              </li>

              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 shrink-0 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>candelariaeyecareclinic@gmail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Clinic Hours</h4>
            <ul className="space-y-3 text-red-100 text-sm">
              <li className="flex justify-between">
                <span>Monday - Saturday:</span> <span>9:00 AM - 5:30 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span> <span>Closed</span>
              </li>
            </ul>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 w-full py-2 bg-white text-deep-red font-bold text-sm rounded-lg hover:bg-red-50 transition-colors"
            >
              Patient Portal Login
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-red-200 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Candelaria Eye Care Clinic. All
            rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-white">
              Privacy Policy
            </span>
            <span className="cursor-pointer hover:text-white">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
