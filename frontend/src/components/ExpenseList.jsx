import React from 'react';

function ExpenseList({ expenses, onDelete, onEdit }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="expense-list">
      <h2>Expense List ({expenses.length})</h2>
      {expenses.length === 0 ? (
        <div className="no-data">
          <p>📝 No expenses found. Add your first expense!</p>
        </div>
      ) : (
        <div className="expense-cards">
          {expenses.map(expense => (
            <div key={expense._id} className="expense-card">
              <div className="expense-header">
                <h3>{expense.category}</h3>
                {expense.optimizable && (
                  <span className="badge optimizable">✓ Optimizable</span>
                )}
              </div>
              <p className="description">{expense.description}</p>
              <div className="expense-details">
                <div className="detail-row">
                  <span className="label">Amount:</span>
                  <span className="amount">${expense.amount.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date:</span>
                  <span>{formatDate(expense.date)}</span>
                </div>
                {expense.savings > 0 && (
                  <div className="detail-row savings-row">
                    <span className="label">Potential Savings:</span>
                    <span className="savings">💰 ${expense.savings.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <div className="expense-actions">
                <button className="btn-edit" onClick={() => onEdit(expense)}>
                  ✏️ Edit
                </button>
                <button className="btn-delete" onClick={() => onDelete(expense._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;