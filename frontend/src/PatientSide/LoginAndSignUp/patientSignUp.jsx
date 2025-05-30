import React from "react";
import LogInHeader from "./patientPortalLoginHeader";
import SignUpForm from "./patientSignUpInput";
import ChangeTo from "./change";
import "./patientPortalLogin.css";

function PatientSignUp() {
  return (
    <div className="patientSignUp">
      <div className="container">
        <div className="image_container"></div>
        <div className="form_container">
          <LogInHeader />
          <SignUpForm />
          <ChangeTo
            text="Have an account already?"
            link="/"
            linkText="Log In"
          />
        </div>
      </div>
    </div>
  );
}

export default PatientSignUp;
