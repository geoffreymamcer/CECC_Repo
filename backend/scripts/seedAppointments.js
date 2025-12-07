import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// IMPORT MODELS
import Profile from "../models/Profile.js";
import Appointment from "../models/Appointment.js";

// CONFIG
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// --- DATA CONFIGURATION ---

const SERVICE_TYPES = [
  "Comprehensive Eye Exam",
  "Contact Lens Fitting",
  "Glaucoma Screening",
  "Dry Eye Therapy",
  "Follow-up Checkup",
  "Pediatric Eye Exam",
  "Optical Coherence Tomography (OCT)",
];

const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "04:00 PM",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// 👇 CRITICAL HELPER: Generates a date centered in the UTC day
const getSafeUTCDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);

  // We explicitly use Date.UTC to construct the timestamp
  // We set hours to 12 (Noon) to ensure it is safely inside the day
  // regardless of minor timezone shifts.
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  );
};

const getRealisticStatus = (appointmentDate) => {
  const today = new Date();

  if (appointmentDate < today) {
    // Past appointments
    const rand = Math.random();
    if (rand < 0.85) return "completed";
    if (rand < 0.95) return "cancelled";
    return "pending";
  } else {
    // Future appointments
    const rand = Math.random();
    if (rand < 0.6) return "scheduled";
    if (rand < 0.95) return "confirmed";
    return "pending";
  }
};

// --- MAIN SEED FUNCTION ---

const seedAppointments = async () => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI missing in .env");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const profiles = await Profile.find({});
    console.log(
      `Found ${profiles.length} profiles. Generating UTC-safe appointments...`
    );

    let totalAppointments = 0;

    for (const profile of profiles) {
      const patientId = profile.patientId || profile._id;
      const fullName = `${profile.firstName} ${profile.lastName}`;
      const phoneNumber =
        profile.phone_number || profile.contact || "09000000000";

      // Create 1 to 4 appointments per patient
      const numberOfAppointments = Math.floor(Math.random() * 4) + 1;

      for (let i = 0; i < numberOfAppointments; i++) {
        // Generate a date between -60 days (past) and +30 days (future)
        const dayOffset = Math.floor(Math.random() * 90) - 60;

        // This date is now guaranteed to be 12:00:00 UTC
        const utcDate = getSafeUTCDate(dayOffset);

        const status = getRealisticStatus(utcDate);
        const service = getRandomItem(SERVICE_TYPES);
        const time = getRandomItem(TIME_SLOTS);

        const appointment = new Appointment({
          patientId: patientId,
          fullName: fullName,
          phoneNumber: phoneNumber,
          appointmentDate: utcDate, // Saving as UTC Noon
          appointmentTime: time,
          serviceType: service,
          status: status,
          notes:
            status === "cancelled"
              ? "Rescheduled due to conflict"
              : "Routine checkup",
        });

        await appointment.save();
        totalAppointments++;
      }
    }

    console.log(
      `🎉 Success! Generated ${totalAppointments} UTC-safe appointments.`
    );
    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedAppointments();
