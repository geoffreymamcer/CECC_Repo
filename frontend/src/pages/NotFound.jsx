import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6 border-8 border-double border-gray-100">
      <div className="animate-fadeInUp space-y-2 mb-10">
        <p className="text-xs tracking-[0.5em] font-serif text-gray-400 uppercase">
          Error Code
        </p>

        <div className="flex flex-col items-center font-serif leading-none text-deep-red select-none">
          <span className="text-9xl font-bold">4</span>
          <span className="text-8xl font-bold opacity-90">0</span>
          <span className="text-7xl font-bold opacity-80">4</span>
        </div>
      </div>

      <div
        className="max-w-md mx-auto space-y-6 animate-fadeInUp"
        style={{ animationDelay: "0.2s" }}
      >
        <h2 className="text-2xl font-bold text-gray-900">
          We can't find that page.
        </h2>
        <p className="text-gray-600">
          It looks like you've wandered into a blind spot. Please check the URL
          or head back to the clinic reception.
        </p>

        <Link
          to="/"
          className="group relative inline-flex items-center justify-start overflow-hidden rounded bg-deep-red px-8 py-3 transition-all hover:bg-white border-2 border-transparent hover:border-deep-red"
        >
          <span className="absolute bottom-0 left-0 mb-9 ml-9 h-48 w-48 -translate-x-full translate-y-full rotate-45 rounded bg-dark-red opacity-100 transition-all duration-500 ease-out group-hover:translate-x-0"></span>
          <span className="relative w-full text-left text-white transition-colors duration-300 ease-in-out group-hover:text-deep-red font-semibold">
            Go Back Home
          </span>
        </Link>
      </div>

      <div className="fixed bottom-0 w-full h-2 bg-gradient-to-r from-white via-deep-red to-white opacity-20"></div>
    </div>
  );
};

export default NotFound;
