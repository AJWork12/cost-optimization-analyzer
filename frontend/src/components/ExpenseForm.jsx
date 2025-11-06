import React, { useState, useEffect } from 'react';

function ExpenseForm({ onSubmit, editingExpense, onCancel }) {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    optimizable: false,
    savings: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        category: editingExpense.category,
        description: editingExpense.description,
        amount: editingExpense.amount.toString(),
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        optimizable: editingExpense.optimizable,
        savings: editingExpense.savings.toString()
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submissionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      savings: formData.savings ? parseFloat(formData.savings) : 0
    };
    
    if (editingExpense) {
      onSubmit(editingExpense._id, submissionData);
    } else {
      onSubmit(submissionData);
    }
    
    // Reset form
    setFormData({
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      optimizable: false,
      savings: ''
    });
  };

  const categories = [
    'Cloud Services',
    'Software Licenses',
    'Marketing',
    'Operations',
    'Human Resources',
    'Office Supplies',
    'Travel',
    'Other'
  ];

  return (
    <div className="expense-form">
      <h2>{editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="optimizable"
              checked={formData.optimizable}
              onChange={handleChange}
            />
            <span>✓ This expense is optimizable</span>
          </label>
        </div>

        {formData.optimizable && (
          <div className="form-group">
            <label htmlFor="savings">Potential Savings ($)</label>
            <input
              type="number"
              id="savings"
              name="savings"
              value={formData.savings}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingExpense ? '💾 Update Expense' : '➕ Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;