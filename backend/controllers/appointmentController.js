import Appointment from "../models/Appointment.js";
import User from "../models/User.js";

// Get all appointments (admin) with optional date filtering
export const getAllAppointments = async (req, res) => {
  try {
    let { date } = req.query; // date in YYYY-MM-DD
    let filter = {};
    if (date) {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: dayStart, $lte: dayEnd };
    }
    const appointments = await Appointment.find(filter).sort({ appointmentDate: 1, appointmentTime: 1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching all appointments:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching appointments",
    });
  }
};

// Create new appointment
export const createAppointment = async (req, res) => {
  try {
    const { appointmentDate, appointmentTime, serviceType, notes, visitStatus, additionalNotes } = req.body;

    // Get user data from the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Create appointment with user info
    const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`.trim();
    const appointment = await Appointment.create({
      patientId: user.patientId,
      fullName,
      phoneNumber: user.phone_number,
      appointmentDate,
      appointmentTime,
      serviceType,
      visitStatus,
      notes: notes || additionalNotes || "",
    });

    res.status(201).json({
      status: "success",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating appointment",
    });
  }
};

// Get patient's appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.find({ patientId }).sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching appointments",
    });
  }
};

// Update (reschedule) appointment date and/or time
export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, appointmentTime } = req.body;
    const updateFields = {};
    if (appointmentDate) updateFields.appointmentDate = appointmentDate;
    if (appointmentTime) updateFields.appointmentTime = appointmentTime;
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateFields },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ status: "error", message: "Appointment not found" });
    }
    res.status(200).json({ status: "success", appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ status: "error", message: error.message || "Error updating appointment" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        status: "error",
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      status: "success",
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error updating appointment",
    });
  }
};
