import React, { useState } from "react";
import Logo from "./Logo";
import Title from "./Title";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import "./PatientLogin.css";
import banner from "./LoginAndSignUpAssets/CECC_Cover.png";

export default function AuthCard() {
  const [isSignup, setIsSignup] = useState(false);
  const toggleForm = () => setIsSignup(!isSignup);

  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-scaleIn">
      {/* Left Side: Visuals & Branding (Desktop) */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        <img
          src={banner}
          alt="Clinic Interior"
          className="w-full h-full object-cover absolute inset-0"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#5a0000] via-[#7F0000]/80 to-transparent opacity-90" />

        <div className="absolute bottom-0 left-0 p-12 text-white z-10">
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            {isSignup ? "Join our Community" : "Welcome Back."}
          </h2>
          <p className="text-lg text-white/90 font-light">
            Experience world-class eye care services within your reach.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="md:hidden flex justify-center mb-6">
          <Logo size="small" />
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="hidden md:block text-center mb-8">
            <Logo size="medium" /> {/* Adjusted size prop usage */}
          </div>

          <Title
            small={false}
            text={
              isSignup
                ? "Create Account"
                : "Candelaria Eye Care Clinic Patient Portal"
            }
          />

          <div className="transition-all duration-500 ease-in-out">
            {isSignup ? (
              <SignupForm toggleForm={toggleForm} />
            ) : (
              <LoginForm toggleForm={toggleForm} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
