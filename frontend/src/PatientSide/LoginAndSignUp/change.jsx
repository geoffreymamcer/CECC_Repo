import React from "react";
import { Link } from "react-router-dom";
import "./patientPortalLogin.css";

function ChangeTo(props) {
  return (
    <div className="changeTo">
      <p className="paragraph-text">{props.text}</p>
      <Link className="link-text" to={props.link}>
        {props.linkText}
      </Link>
    </div>
  );
}

export default ChangeTo;
