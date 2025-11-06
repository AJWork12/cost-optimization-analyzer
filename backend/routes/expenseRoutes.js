import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getAnalytics
} from '../controllers/expenseController.js';

const router = express.Router();

// Expense routes
router.route('/expenses')
  .get(getExpenses)
  .post(createExpense);

router.route('/expenses/:id')
  .get(getExpenseById)
  .put(updateExpense)
  .delete(deleteExpense);

// Analytics route
router.get('/analytics', getAnalytics);

export default router;
Response