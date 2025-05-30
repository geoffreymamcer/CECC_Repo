import React from "react";
import LogInHeader from "./patientPortalLoginHeader";
import PatientLogInForm from "./patientLoginInput";
import ChangeTo from "./change";
import "./patientPortalLogin.css";

function PatientLogInUI() {
  return (
    <div className="loginUI">
      <div className="container">
        <div className="image_container"></div>
        <div className="form_container">
          <LogInHeader />
          <PatientLogInForm />
          <ChangeTo
            text="Don't have an account?"
            link="/patient-signup"
            linkText="Sign Up"
          />
        </div>
      </div>
    </div>
  );
}

export default PatientLogInUI;
