import express from 'express';
import { getRecurringIncomes, createRecurringIncome, updateRecurringIncome, deleteRecurringIncome } from '../Controller/recurringIncomesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getRecurringIncomes);
router.post('/', authMiddleware, createRecurringIncome);
router.put('/:id', authMiddleware, updateRecurringIncome);
router.delete('/:id', authMiddleware, deleteRecurringIncome);

export default router;
