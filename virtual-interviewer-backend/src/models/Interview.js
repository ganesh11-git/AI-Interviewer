import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userEmail: String,
  type: String,
  score: Number,
  feedback: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Interview", interviewSchema);
