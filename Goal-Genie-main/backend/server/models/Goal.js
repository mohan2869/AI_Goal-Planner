import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  title: String,
  startDate: Date,
  numberOfDays: Number,
  hoursPerDay: Number,
  ytLink: String,
  dailyPlan: [Object], // AI-generated plan
}, { timestamps: true });

export default mongoose.model('Goal', goalSchema);
