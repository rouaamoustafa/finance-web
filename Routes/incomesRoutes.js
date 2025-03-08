import express from 'express';
import {
  getIncomes,
  createIncome,
  updateIncome,
  deleteIncome
} from '../Controller/incomesController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all incomes (admin & subadmin can access)
router.get('/', authMiddleware, getIncomes);

// POST new income (only subadmin)
router.post('/', authMiddleware,createIncome);

// PUT (edit income) (only subadmin)
router.put('/:id', authMiddleware, updateIncome);

// DELETE an income (only admin)
router.delete('/:id', authMiddleware, deleteIncome);

export default router;
