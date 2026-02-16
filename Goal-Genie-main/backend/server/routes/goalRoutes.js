import express from 'express';
import { createGoal } from '../controllers/goalController.js';
const router = express.Router();

router.post('/', createGoal);

export default router;
