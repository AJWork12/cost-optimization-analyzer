import Expense from '../models/Expense.js';

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Public
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Public
export const createExpense = async (req, res) => {
  try {
    const { category, description, amount, date, optimizable, savings } = req.body;
    
    const expense = await Expense.create({
      category,
      description,
      amount,
      date,
      optimizable,
      savings
    });
    
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Public
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    const { category, description, amount, date, optimizable, savings } = req.body;
    
    expense.category = category || expense.category;
    expense.description = description || expense.description;
    expense.amount = amount !== undefined ? amount : expense.amount;
    expense.date = date || expense.date;
    expense.optimizable = optimizable !== undefined ? optimizable : expense.optimizable;
    expense.savings = savings !== undefined ? savings : expense.savings;
    
    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Public
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    
    await expense.deleteOne();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics
// @route   GET /api/analytics
// @access  Public
export const getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find();
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Calculate total savings
    const totalSavings = expenses.reduce((sum, e) => sum + e.savings, 0);
    
    // Count optimizable expenses
    const optimizableCount = expenses.filter(e => e.optimizable).length;
    
    // Category breakdown
    const categoryBreakdown = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyExpenses = await Expense.aggregate([
      {
        $match: {
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    res.json({
      totalExpenses,
      totalSavings,
      optimizableCount,
      categoryBreakdown,
      savingsPercentage: totalExpenses > 0 ? ((totalSavings / totalExpenses) * 100).toFixed(2) : 0,
      monthlyTrend: monthlyExpenses,
      totalCount: expenses.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};