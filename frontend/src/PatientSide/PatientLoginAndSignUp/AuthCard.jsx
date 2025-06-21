import React, { useState } from "react";
import Logo from "./Logo";
import Title from "./Title";
import LoginForm from "./LoginForm";
import SignupForm from "./SignUpForm";
import "./PatientLogin.css";
import banner from "../LoginAndSignUp/LoginAndSignUpAssets/login banner image.webp";

export default function AuthCard() {
  const [isSignup, setIsSignup] = useState(false);
  const toggleForm = () => setIsSignup(!isSignup);

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Desktop */}
      <div className="hidden md:flex">
        <div className="w-[50%] bg-gray-100 relative overflow-hidden">
          <img
            src={banner}
            alt="Optometrist"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
        </div>
        <div className="w-[50%] p-8 flex flex-col items-center justify-center">
          <Logo />
          <Title />
          {isSignup ? (
            <SignupForm toggleForm={toggleForm} />
          ) : (
            <LoginForm toggleForm={toggleForm} />
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden p-8 flex flex-col items-center bg-white rounded-xl">
        <Logo size="small" />
        <Title small />
        {isSignup ? (
          <SignupForm toggleForm={toggleForm} />
        ) : (
          <LoginForm toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
}
