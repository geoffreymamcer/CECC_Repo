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

export const createAppointment = async (req, res) => {
  try {
    const {
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      visitStatus,
      additionalNotes,
      fullName: manualFullName,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    let finalFullName;
    let finalPatientId;
    let finalPhoneNumber;

    const isAdminBooking =
      (user.role === "admin" || user.role === "owner") && manualFullName;

    if (isAdminBooking) {
      finalFullName = manualFullName;
      finalPatientId = "WALK-IN-" + Date.now();
      finalPhoneNumber = "N/A (Walk-in)";
    } else {
      finalFullName = `${user.firstName} ${
        user.middleName ? user.middleName + " " : ""
      }${user.lastName}`.trim();

      finalPatientId = user.patientId || user._id;
      finalPhoneNumber = user.phone_number;
    }

    const appointment = await Appointment.create({
      patientId: finalPatientId,
      fullName: finalFullName,
      phoneNumber: finalPhoneNumber,
      appointmentDate,
      appointmentTime,
      serviceType,
      visitStatus,
      notes: notes || additionalNotes || "",
    });

    if (!isAdminBooking) {
      try {
        await sendAppointmentConfirmationEmail({
          email: user.email,
          firstName: user.firstName,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          serviceType: appointment.serviceType,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError.message);
      }

      // 1️⃣ START MODIFICATION: Notify Admins on Patient Booking
      // If a patient booked this, notify the admins/owner
      try {
        // Find all users with role 'admin' or 'owner'
        // Ensure you have these roles defined in your User model
        const admins = await User.find({ role: { $in: ["admin", "owner"] } });

        for (const admin of admins) {
          const notificationPayload = {
            recipient: admin._id, // Send to this specific admin's ID
            title: "New Appointment Request",
            message: `${finalFullName} has requested an appointment for ${serviceType} on ${new Date(
              appointmentDate
            ).toLocaleDateString()}.`,
            type: "appointment",
            link: "/cecc-admin-dashboard?tab=Appointments", // Link to admin dashboard tab
          };

          // Save to DB
          await Notification.create(notificationPayload);

          // Emit real-time event if admin is online
          // Assuming req.onlineUsers is a Map<userId, socketId> available in your request context
          if (req.onlineUsers && req.onlineUsers.has(admin._id.toString())) {
            const adminSocketId = req.onlineUsers.get(admin._id.toString());
            req.io
              .to(adminSocketId)
              .emit("new_notification", notificationPayload);
          }
        }
      } catch (notifyError) {
        console.error("Failed to notify admins:", notifyError);
        // Don't fail the request just because notification failed
      }
      // 1️⃣ END MODIFICATION
    }

    // ... (rest of admin notification logic for MANUAL bookings if needed, usually redundant if handled above)

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

export const updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { appointmentDate, appointmentTime } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // --- SECURITY CHECK ---
    const userIsOwner = appointment.patientId === req.user.id;
    const userIsAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!userIsOwner && !userIsAdmin) {
      return res.status(403).json({
        message: "Forbidden: You can only modify your own appointments.",
      });
    }

    const updateFields = {};
    if (appointmentDate) updateFields.appointmentDate = appointmentDate;
    if (appointmentTime) updateFields.appointmentTime = appointmentTime;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $set: updateFields },
      { new: true }
    );

    if (userIsOwner && !userIsAdmin) {
      try {
        const admins = await User.find({ role: { $in: ["admin", "owner"] } });

        for (const admin of admins) {
          const notificationPayload = {
            recipient: admin._id,
            title: "Appointment Rescheduled",
            message: `${
              appointment.fullName
            } has rescheduled their appointment to ${new Date(
              updatedAppointment.appointmentDate
            ).toLocaleDateString()} at ${updatedAppointment.appointmentTime}.`,
            type: "reschedule",
            link: "/cecc-admin-dashboard?tab=Appointments",
          };

          await Notification.create(notificationPayload);

          if (req.onlineUsers && req.onlineUsers.has(admin._id.toString())) {
            const adminSocketId = req.onlineUsers.get(admin._id.toString());
            req.io
              .to(adminSocketId)
              .emit("new_notification", notificationPayload);
          }
        }
      } catch (notifyError) {
        console.error("Failed to notify admins of reschedule:", notifyError);
      }
    }

    res
      .status(200)
      .json({ status: "success", appointment: updatedAppointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ message: "Error updating appointment" });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, cancellationReason } = req.body; // Added cancellationReason extraction

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const userIsOwner = appointment.patientId === req.user.id;
    const userIsAdmin = req.user.role === "admin" || req.user.role === "owner";

    if (!userIsOwner && !userIsAdmin) {
      return res.status(403).json({
        message: "Forbidden: You can only modify your own appointments.",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    // 2️⃣ START MODIFICATION: Notify Admins on Patient Cancellation
    // If the status is being set to 'cancelled' AND it was done by the patient (not admin)
    if (status === "cancelled" && userIsOwner && !userIsAdmin) {
      try {
        const admins = await User.find({ role: { $in: ["admin", "owner"] } });

        for (const admin of admins) {
          const notificationPayload = {
            recipient: admin._id,
            title: "Appointment Cancelled",
            message: `${
              appointment.fullName
            } has cancelled their appointment scheduled for ${new Date(
              appointment.appointmentDate
            ).toLocaleDateString()}. Reason: ${
              cancellationReason || "No reason provided"
            }`,
            type: "cancellation",
            link: "/cecc-admin-dashboard?tab=Appointments",
          };

          await Notification.create(notificationPayload);

          if (req.onlineUsers && req.onlineUsers.has(admin._id.toString())) {
            const adminSocketId = req.onlineUsers.get(admin._id.toString());
            req.io
              .to(adminSocketId)
              .emit("new_notification", notificationPayload);
          }
        }
      } catch (notifyError) {
        console.error("Failed to notify admins of cancellation:", notifyError);
      }
    }
    // 2️⃣ END MODIFICATION

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

    const upcomingAppointments = await Appointment.find({
      appointmentDate: { $gte: now },
      status: { $nin: ["cancelled", "completed"] },
    }).sort({ appointmentDate: 1, appointmentTime: 1 });

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
