import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    collegeYear: { type: String, required: true },
    role: { type: String, required: true },
    q1: { type: String }, // Motivation
    q2: { type: String }, // Task process
    q3: { type: String }, // Unknown task approach
    q4: { type: String }, // Consistency
    q5: { type: String }, // Pressure handling
    hours: { type: String },
    resumeLink: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);
