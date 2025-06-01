import React from "react";
import "./patientPortalLogin.css";
import ceccLogo from "./LoginAndSignUpAssets/cecc.png";
function LogInHeader() {
  return (
    <header className="loginHeader">
      <img src={ceccLogo} className="cecc-logo" alt="CECC Logo" />
      <h1 className="cecc-subtitle">
        World Class Eye Care <span className="no-gap">Within Your Reach</span>
      </h1>
    </header>
  );
}

export default LogInHeader;
