import Goal from '../models/Goal.js';
import { generatePlanFromGoal } from '../utils/aiPlanner.js';

export const createGoal = async (req, res) => {
  try {
    const { title, startDate, numberOfDays, hoursPerDay, ytLink } = req.body;

    const dailyPlan = await generatePlanFromGoal(title, numberOfDays, hoursPerDay, ytLink);

    const newGoal = new Goal({ 
      title, 
      startDate, 
      numberOfDays, 
      hoursPerDay, 
      ytLink, 
      dailyPlan 
    });
    await newGoal.save();

    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong generating the plan." });
  }
};
