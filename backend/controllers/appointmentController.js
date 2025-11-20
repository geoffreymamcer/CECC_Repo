import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendAppointmentConfirmationEmail } from "../services/emailService.js";

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
    const appointments = await Appointment.find(filter).sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });
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
    const {
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      visitStatus,
      additionalNotes,
    } = req.body;

    // Get user data from the authenticated user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Create appointment with user info
    const fullName = `${user.firstName} ${
      user.middleName ? user.middleName + " " : ""
    }${user.lastName}`.trim();

    // Use patientId if available, otherwise use _id (which should be the custom ID for patients)
    const patientIdToUse = user.patientId || user._id;

    console.log(`Creating appointment for patient ID: ${patientIdToUse}`);

    const appointment = await Appointment.create({
      patientId: patientIdToUse,
      fullName,
      phoneNumber: user.phone_number,
      appointmentDate,
      appointmentTime,
      serviceType,
      visitStatus,
      notes: notes || additionalNotes || "",
    });

    try {
      await sendAppointmentConfirmationEmail({
        email: user.email,
        firstName: user.firstName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        serviceType: appointment.serviceType,
      });
    } catch (emailError) {
      console.error(
        "Failed to send appointment confirmation email:",
        emailError.message
      );
    }

    const adminRecipientIds = ["6869154e483aab1aa36acf26", "CECC25-0004"];

    for (const adminId of adminRecipientIds) {
      const notificationPayload = {
        recipient: adminId, // Use the ID from the current loop iteration
        title: "New Appointment Booked",
        message: `${fullName} has booked an appointment for ${serviceType} on ${new Date(
          appointmentDate
        ).toLocaleDateString()}.`,
        type: "appointment",
        link: "/cecc-admin-dashboard?tab=Appointments",
      };

      // Save the notification to the database for this specific admin
      await Notification.create(notificationPayload);

      // Emit a real-time event if this specific admin is online
      const recipientSocketId = req.onlineUsers.get(adminId);
      if (recipientSocketId) {
        req.io
          .to(recipientSocketId)
          .emit("new_notification", notificationPayload);
        console.log(`Sent new appointment notification to admin ${adminId}`);
      } else {
        console.log(`Admin ${adminId} is offline. Notification saved to DB.`);
      }
    }

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

    console.log(`Fetching appointments for patient ID: ${patientId}`);

    // First, try to find a user with this ID to determine if it's a custom ID or patientId
    const user = await User.findOne({
      $or: [{ _id: patientId }, { patientId: patientId }],
    });

    // If we found a user, use their patientId (which should match _id for new users)
    const queryPatientId = user?.patientId || patientId;

    console.log(`Using query patientId: ${queryPatientId}`);

    const appointments = await Appointment.find({
      patientId: queryPatientId,
    }).sort({
      appointmentDate: 1,
      appointmentTime: 1,
    });

    console.log(`Found ${appointments.length} appointments`);

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

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 👇 START OF CHANGE 🚀
    // --- SECURITY CHECK ---
    // Allow if the user is an admin/owner OR if they are the patient who owns the appointment.
    const userIsOwner = appointment.patientId === req.user.id;
    const userIsAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!userIsOwner && !userIsAdmin) {
      return res.status(403).json({
        message: "Forbidden: You can only modify your own appointments.",
      });
    }
    // 👆 END OF CHANGE

    const updateFields = {};
    if (appointmentDate) updateFields.appointmentDate = appointmentDate;
    if (appointmentTime) updateFields.appointmentTime = appointmentTime;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateFields },
      { new: true }
    );

    res
      .status(200)
      .json({ status: "success", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

// Update appointment status
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // 👇 START OF CHANGE 🚀
    // --- SECURITY CHECK ---
    // Allow if the user is an admin/owner OR if they are the patient who owns the appointment.
    const userIsOwner = appointment.patientId === req.user.id;
    const userIsAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!userIsOwner && !userIsAdmin) {
      return res.status(403).json({
        message: "Forbidden: You can only modify your own appointments.",
      });
    }
    // 👆 END OF CHANGE

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    res
      .status(200)
      .json({ status: "success", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment status:", error);
    res.status(500).json({ message: "Error updating appointment status" });
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const now = new Date();

    // Find all appointments that are scheduled for the future and are not cancelled
    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: now },
      status: { $nin: ["cancelled", "completed"] }, // Exclude cancelled and completed
    }).sort({ appointmentDate: 1, appointmentTime: 1 }); // Sort by soonest first

    res.status(200).json(upcomingAppointments);
  } catch (error) {
    console.error("Error fetching upcoming appointments:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching upcoming appointments",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // req.user.id is populated by the 'auth' middleware
    const patientId = req.user.id;
    console.log(`Fetching appointments for authenticated user: ${patientId}`);

    const appointments = await Appointment.find({ patientId: patientId }).sort({
      appointmentDate: -1, // Sort by most recent first
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching user's appointments:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error fetching appointments",
    });
  }
};
