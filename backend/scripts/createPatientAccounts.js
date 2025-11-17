// Filename: scripts/createPatients.js

import mongoose from "mongoose";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

// Load environment variables from your .env file
dotenv.config({ path: "./.env" }); // Explicitly set path to ensure it's found

// --- CONFIGURATION ---
const patientNames = [
  "Maria Marasigan",
  "Arnel Aquino",
  "John Paul Gonzales",
  "Ruth Tolentino",
  "Rafael Vargas",
  "James De Guzman",
  "Paul Marquez",
  "Samuel De Torres",
  "Kevin Dela Cruz",
  "Anna Mae Tan",
  "Samuel Umali",
  "Anna Mae Vargas",
  "Liza Valencia",
  "Maria Fe Tan",
  "Grace Garcia",
  "Allan Vargas",
  "Gabriel Delos Santos",
  "Nicole Gutierrez",
  "Anna Mae De Torres",
  "Joshua Garcia",
  "Jose Aguilar",
  "Christine Flores",
  "Michelle Flores",
  "James Manalo",
  "Daniel Umali",
  "John Paul Reyes",
  "Jomar Delos Santos",
  "Mark Villanueva",
  "Jessa Dela Cruz",
  "Mary Ann Sanchez",
  "Mark Anthony Garcia",
  "Mary Ann Ramos",
  "Ana Mendoza",
  "Mark Anthony Lopez",
  "Jenny Tolentino",
  "Daniel Ramos",
  "Grace Sanchez",
  "Grace Vargas",
];
const COMMON_PASSWORD = "patientpassword123";

// --- SCRIPT LOGIC ---
const createPatientAccounts = async () => {
  if (!process.env.MONGODB_URI) {
    console.error(
      "ERROR: MONGODB_URI is not defined in your .env file. Make sure your .env file is in the 'backend' directory."
    );
    return;
  }

  // --- FIX: ESTABLISH CONNECTION AND SESSION AT THE START ---
  let session;
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully to MongoDB.");

    session = await mongoose.startSession(); // Start the session only AFTER connecting
    // --- END OF FIX ---

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(COMMON_PASSWORD, salt);
    let createdCount = 0;

    for (const fullName of patientNames) {
      session.startTransaction();
      try {
        const nameParts = fullName.trim().split(" ");
        if (nameParts.length < 2) {
          console.warn(`- Skipping invalid name: "${fullName}"`);
          continue;
        }
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        const email = `${firstName.toLowerCase()}.${lastName
          .toLowerCase()
          .replace(/\s/g, "")}@gmail.com`;
        const phone_number = `09${Math.floor(
          100000000 + Math.random() * 900000000
        )}`;

        const existingUser = await User.findOne({
          $or: [{ email }, { phone_number }],
        }).session(session);
        if (existingUser) {
          console.log(
            `- Skipping "${fullName}" - User with email or phone already exists.`
          );
          await session.abortTransaction();
          continue;
        }

        const currentYear = new Date().getFullYear().toString().slice(-2);
        const prefix = `CECC${currentYear}-`;
        const highestUser = await User.findOne(
          { _id: new RegExp(`^${prefix}`) },
          { _id: 1 },
          { sort: { _id: -1 } }
        ).session(session);
        const highestProfile = await Profile.findOne(
          { _id: new RegExp(`^${prefix}`) },
          { _id: 1 },
          { sort: { _id: -1 } }
        ).session(session);

        let nextNumber = 1;
        if (highestUser && highestUser._id) {
          nextNumber = parseInt(highestUser._id.split("-")[1]) + 1;
        }
        if (highestProfile && highestProfile._id) {
          const profileNumber = parseInt(highestProfile._id.split("-")[1]);
          if (profileNumber >= nextNumber) {
            nextNumber = profileNumber + 1;
          }
        }
        const customId = `${prefix}${nextNumber.toString().padStart(4, "0")}`;

        const userData = {
          _id: customId,
          firstName,
          lastName,
          phone_number,
          email,
          password: hashedPassword,
          role: "patient",
          patientId: customId,
        };
        await User.create([userData], { session });

        const profileData = {
          _id: customId,
          patientId: customId,
          firstName,
          lastName,
          email,
          phone_number,
          address: "",
          dob: "",
        };
        await Profile.create([profileData], { session });

        await session.commitTransaction();
        console.log(
          `✔ Successfully created account for: ${fullName} (ID: ${customId})`
        );
        createdCount++;
      } catch (error) {
        console.error(
          `✖ ERROR creating account for "${fullName}":`,
          error.message
        );
        await session.abortTransaction();
      }
    }

    console.log(`\n--- Script Finished ---`);
    console.log(
      `Total accounts created: ${createdCount} / ${patientNames.length}`
    );
  } catch (error) {
    console.error("A critical error occurred:", error.message);
    console.log(
      "Please ensure your MongoDB server is running and the MONGODB_URI in your .env file is correct."
    );
  } finally {
    if (session) {
      session.endSession();
    }
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

createPatientAccounts();
