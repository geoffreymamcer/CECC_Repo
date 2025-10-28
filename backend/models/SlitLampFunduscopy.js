import mongoose from "mongoose";

// A helper schema for individual eye examination fields
const eyeExaminationSchema = new mongoose.Schema(
  {
    lidsLashes: { type: String, default: "" },
    conjunctiva: { type: String, default: "" },
    sclera: { type: String, default: "" },
    cornea: { type: String, default: "" },
    ac: { type: String, default: "" }, // Anterior Chamber
    iris: { type: String, default: "" },
    pupil: { type: String, default: "" },
    lens: { type: String, default: "" },
    iop: { type: String, default: "" }, // Intraocular Pressure
    iopType: { type: String, default: "" },
    iopTime: { type: String, default: "" },
  },
  { _id: false }
);

// A helper schema for funduscopy fields
const funduscopySchema = new mongoose.Schema(
  {
    retina: { type: String, default: "" },
    macula: { type: String, default: "" },
    vessels: { type: String, default: "" },
    avr: { type: String, default: "" }, // Arteriovenous Ratio
    opticDisc: { type: String, default: "" },
    cdr: { type: String, default: "" }, // Cup-to-disc Ratio
    others: { type: String, default: "" },
  },
  { _id: false }
);

const slitLampFunduscopySchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      ref: "Profile",
      required: true,
      unique: true,
    },
    slitLamp: {
      od: eyeExaminationSchema,
      os: eyeExaminationSchema,
    },
    funduscopy: {
      od: funduscopySchema,
      os: funduscopySchema,
    },
  },
  { timestamps: true }
);

const SlitLampFunduscopy = mongoose.model(
  "SlitLampFunduscopy",
  slitLampFunduscopySchema
);

export default SlitLampFunduscopy;
