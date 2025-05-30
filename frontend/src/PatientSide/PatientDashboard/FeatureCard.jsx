import React from "react";

function FeaturesCard(props) {
  return (
    <div className="featureCard" onClick={props.onClick}>
      <span className="emoji_container">{props.icon}</span>
      <div className="featureTextContainer">
        <h3 className="featureName">{props.feature}</h3>
        <p className="feautureDescription">{props.description}</p>
      </div>
      <div className="arrowContainer">🠪</div>
    </div>
  );
}

export default FeaturesCard;
