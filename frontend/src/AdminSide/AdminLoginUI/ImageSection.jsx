// --- START OF FILE ImageSection.jsx ---

import React from "react";
import { ShieldCheck, BarChart3, Lock } from "lucide-react";
import "./AdminLogin.css";

const ImageSection = () => {
  return (
    <div className="relative w-full md:w-5/12 bg-[#800000] text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-20"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#b30000] to-[#600000] opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur-md rounded-xl mb-6 border border-white/20">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Admin Portal
          </h2>
          <p className="text-red-100 text-lg font-light leading-relaxed">
            Secure access to patient management, appointments, and clinic
            analytics.
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-4 animate-fade-in delay-100 hidden md:block">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <Lock className="text-red-200" size={20} />
            <div>
              <p className="font-semibold text-sm">Encrypted Access</p>
              <p className="text-xs text-red-200 opacity-80">
                Enterprise grade security
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <BarChart3 className="text-red-200" size={20} />
            <div>
              <p className="font-semibold text-sm">Real-time Insights</p>
              <p className="text-xs text-red-200 opacity-80">
                Dashboard analytics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
