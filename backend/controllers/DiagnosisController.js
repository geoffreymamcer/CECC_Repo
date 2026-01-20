import Diagnosis from "../models/Diagnosis.js";

// Get all diagnoses
export const getAllDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find().sort({ name: 1 });
    res.json(diagnoses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new diagnosis
export const createDiagnosis = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if exists
    const existing = await Diagnosis.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
        return res.status(400).json({ message: "Diagnosis already exists" });
    }

    const newDiagnosis = new Diagnosis({ name, description });
    const savedDiagnosis = await newDiagnosis.save();
    res.status(201).json(savedDiagnosis);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Seed initial diagnoses (for setup)
export const seedDiagnoses = async (req, res) => {
    try {
        const initialDiagnoses = [
            "Myopia", 
            "Hyperopia", 
            "Astigmatism", 
            "Presbyopia",
            "Cataracts",
            "Glaucoma",
            "Diabetic Retinopathy",
            "Macular Degeneration",
            "Dry Eyes",
            "Conjunctivitis",
            "Blepharitis",
            "Uveitis",
            "Keratoconus",
            "Amblyopia",
            "Strabismus",
            "Retinal Detachment",
            "Color Blindness",
            "Pterygium",
            "Pinguecula",
            "Floaters"
        ];
        
        const operations = initialDiagnoses.map(name => ({
            updateOne: {
                filter: { name: name },
                update: { $setOnInsert: { name: name } },
                upsert: true
            }
        }));

        await Diagnosis.bulkWrite(operations);
        res.json({ message: "Diagnoses seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
