import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Cloud Services',
        'Software Licenses',
        'Marketing',
        'Operations',
        'Human Resources',
        'Office Supplies',
        'Travel',
        'Other'
      ]
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
      min: [0, 'Amount must be positive']
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now
    },
    optimizable: {
      type: Boolean,
      default: false
    },
    savings: {
      type: Number,
      default: 0,
      min: [0, 'Savings must be positive']
    }
  },
  {
    timestamps: true
  }
);

// Add index for better query performance
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;