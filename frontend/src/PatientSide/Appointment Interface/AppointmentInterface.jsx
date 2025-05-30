import React from "react";
import AppointmentBanner from "./AppointmentBanner";
import AppointmentInput from "./AppointmentInputs";

function AppointmentInterface() {
  return (
    <div className="AppointmentInterface">
      <AppointmentBanner />
      <AppointmentInput />
    </div>
  );
}

export default AppointmentInterface;
