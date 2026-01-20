import mongoose from "mongoose";
import dotenv from "dotenv";
import DiagnosticAssessmentPlan from "./models/DiagnosticAssessmentPlan.js";
import Product from "./models/Inventory.js";
import Profile from "./models/Profile.js";

dotenv.config();

const runDebug = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB");

    console.log("\n--- Checking Diagnostic Assessment Plans ---");
    const plans = await DiagnosticAssessmentPlan.find().sort({ createdAt: -1 }).limit(5);
    
    for (const p of plans) {
      console.log(`Plan ID: ${p._id}`);
      console.log(`  Patient ID: ${p.patientId} (Type: ${typeof p.patientId})`);
      console.log(`  Primary Impression: "${p.assessment?.primaryImpression}"`);
      console.log(`  Created At: ${p.createdAt}`);
      
      // Check if profile exists for this patientId
      const profile = await Profile.findById(p.patientId);
      console.log(`  Profile Found: ${!!profile}`);
    }

    console.log("\n--- Checking Products ---");
    const products = await Product.find({ tags: { $exists: true, $ne: [] } }).limit(10);
    for (const p of products) {
        console.log(`Product: ${p.productName}`);
        console.log(`  Tags: ${JSON.stringify(p.tags)}`);
    }

    console.log("\n--- Checking 'Myopia' specific product ---");
    const myopiaProd = await Product.findOne({ productName: { $regex: /myopia/i } });
    if(myopiaProd) {
        console.log(`Found Product: ${myopiaProd.productName}`);
        console.log(`  Tags: ${JSON.stringify(myopiaProd.tags)}`);
    } else {
        console.log("No product with 'myopia' in name found.");
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

runDebug();
