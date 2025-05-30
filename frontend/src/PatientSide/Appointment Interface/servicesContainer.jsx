import React, { useState } from "react";

function Services({ onServiceSelect }) {
  // Accept the onServiceSelect prop
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServiceLabel, setSelectedServiceLabel] = useState(null);

  const services = [
    { id: "eyeExam", label: "Eye Exam" },
    { id: "contactLensFitting", label: "Contact Lens Fitting" },
    { id: "glassPrescription", label: "Glass Prescription" },
    { id: "eyeTreatment", label: "Eye Treatment" },
  ];

  const handleClick = (id, label) => {
    const newSelectedId = selectedServiceId === id ? null : id;
    const newSelectedLabel = selectedServiceId === id ? null : label;
    setSelectedServiceId(newSelectedId);
    setSelectedServiceLabel(newSelectedLabel);
    if (onServiceSelect) {
      onServiceSelect(newSelectedLabel); // Call the callback with the service label
    }
  };

  return (
    <div className="service_list">
      {services.map((service) => (
        <button
          key={service.id}
          className={`service ${
            selectedServiceId === service.id ? "active" : ""
          }`}
          onClick={() => handleClick(service.id, service.label)}
          type="button"
        >
          {service.label}
        </button>
      ))}
    </div>
  );
}

export default Services;
