import express from 'express';
import { getRecurringExpenses, createRecurringExpense, updateRecurringExpense, deleteRecurringExpense } from '../Controller/recurringExpensesController.js';
import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

//router.post('/recurring_expenses', authMiddleware, authorizeRole(['subadmin']), createRecurringExpense);
router.get('/', authMiddleware, getRecurringExpenses);
router.post('/', authMiddleware, createRecurringExpense);
router.put('/:id', authMiddleware, updateRecurringExpense);
router.delete('/:id', authMiddleware, deleteRecurringExpense);


export default router;
