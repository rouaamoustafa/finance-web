import express from 'express';
import { getProfitGoals, createProfitGoal, updateProfitGoal, deleteProfitGoal } from '../Controller/profitGoalController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Define API routes
router.get('/', authMiddleware, getProfitGoals);
router.post('/', authMiddleware, authorizeRole(['subadmin']), createProfitGoal);
router.put('/:id', authMiddleware, authorizeRole(['subadmin']), updateProfitGoal); // <-- ADD THIS
router.delete('/:id', authMiddleware, authorizeRole(['subadmin']), deleteProfitGoal);

export default router;
