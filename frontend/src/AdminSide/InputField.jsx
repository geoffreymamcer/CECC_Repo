import React from "react";

function Input(props) {
  return (
    <input
      type={props.type}
      className={props.className}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
      onClick={props.onClick}
    />
  );
}

export default Input;
