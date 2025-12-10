import React from "react";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { Services } from "./Services";
import { Doctors } from "./Doctors";
import { Testimonials } from "./Testimonials";
import { Products } from "./Products";
import { MapSection } from "./MapSection";
import { Footer } from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-slate-900 selection:bg-deep-red selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Doctors />
        <Testimonials />
        <Products />
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
