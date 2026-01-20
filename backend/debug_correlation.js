import mongoose from "mongoose";
import DiagnosticAssessmentPlan from "./models/DiagnosticAssessmentPlan.js";
import Profile from "./models/Profile.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const run = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is missing from .env");

        await mongoose.connect(uri);
        console.log("Connected to DB");

        // 1. Check Diagnoses
        const diagnoses = await DiagnosticAssessmentPlan.find({
            "assessment.primaryImpression": { $ne: null, $ne: "" },
        }).select("patientId assessment.primaryImpression").limit(5);

        console.log("\n--- Sample Diagnoses ---");
        console.log(JSON.stringify(diagnoses, null, 2));
        console.log(`Total Diagnoses Found: ${diagnoses.length}`);

        if (diagnoses.length === 0) {
            console.log("No valid diagnoses found. Exiting.");
            return;
        }

        // 2. Check Profiles for these patients
        const patientIds = [...new Set(diagnoses.map((d) => d.patientId))];
        console.log("\n--- Patient IDs from Diagnoses ---");
        console.log(patientIds);

        const profiles = await Profile.find({
            patientId: { $in: patientIds },
        }).select("patientId ageCategory");

        console.log("\n--- Profiles Found ---");
        console.log(JSON.stringify(profiles, null, 2));

        // Helper to normalize Age Groups
        const normalizeAgeGroup = (age) => {
            if (!age) return "Unknown";
            const normalized = age.toLowerCase();
            if (normalized.includes("child")) return "Child";
            if (normalized.includes("teen")) return "Teen";
            if (normalized.includes("young adult")) return "Young Adult";
            if (normalized.includes("middle") || normalized.includes("adult"))
                return "Adult";
            if (normalized.includes("senior") || normalized.includes("elder"))
                return "Senior";
            return "Unknown";
        };

        // 3. Check Mapping
        const patientAgeMap = {};
        profiles.forEach((p) => {
            patientAgeMap[p.patientId] = normalizeAgeGroup(p.ageCategory);
        });
        
        console.log("\n--- Patient Age Map (Normalized) ---");
        console.log(patientAgeMap);

        // 4. Simulate Matrix Build
        const correlationMatrix = {};
        diagnoses.forEach((d) => {
             // Check if ID matches exactly
             const ageGroup = patientAgeMap[d.patientId] || "Unknown";
             console.log(`Diagnosis PatientID: "${d.patientId}" -> Mapped Age: "${ageGroup}"`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
