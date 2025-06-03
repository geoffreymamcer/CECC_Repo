import React from "react";
import { Outlet } from "react-router-dom";
import FeaturesCard from "./FeatureCard";
import { useNavigate } from "react-router-dom";

function PortalFeatures({}) {
  const navigate = useNavigate();
  // Receive the onColorVisionClick prop
  return (
    <div className="featuresContainer">
      <FeaturesCard
        icon="📋"
        feature="Medical Records"
        description="Access your complete health history, test results, and treatment plans"
        onClick={() => navigate("/records")}
      />

      <FeaturesCard
        icon="🗩"
        feature="Health Assistant"
        description="Get instant answer to your eye concern with our AI assistant"
      />

      <FeaturesCard
        icon="👁️"
        feature="Color Vision Test"
        description="Perform a preliminary color vision test by yourself"
        onClick={() => navigate("/color-vision-test")}
      />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PortalFeatures;
