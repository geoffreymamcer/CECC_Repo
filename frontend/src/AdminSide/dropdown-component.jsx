import React from "react";

function Dropdown({
  name,
  id,
  options = [],
  defaultValue = "",
  className,
  onChange,
  value,
}) {
  return (
    <div className="dropdown-container">
      <select
        name={name}
        id={id}
        defaultValue={defaultValue}
        className={className}
        onChange={onChange}
        value={value} // Controlled input
      >
        <option value="" disabled hidden>
          {defaultValue}
        </option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;
