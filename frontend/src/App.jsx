import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Analytics from './components/Analytics';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('expenses');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('cost-optimizer-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    fetchExpenses();
    fetchAnalytics();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('cost-optimizer-theme', newTheme);
  };

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/expenses`);
      setExpenses(response.data);
    } catch (error) {
      setError('Failed to fetch expenses. Please check if the server is running.');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleAddExpense = async (expense) => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/expenses`, expense);
      await fetchExpenses();
      await fetchAnalytics();
      setActiveTab('expenses');
    } catch (error) {
      setError('Failed to add expense');
      console.error('Error adding expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExpense = async (id, expense) => {
    try {
      setLoading(true);
      await axios.put(`${API_URL}/expenses/${id}`, expense);
      await fetchExpenses();
      await fetchAnalytics();
      setEditingExpense(null);
      setActiveTab('expenses');
    } catch (error) {
      setError('Failed to update expense');
      console.error('Error updating expense:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/expenses/${id}`);
        await fetchExpenses();
        await fetchAnalytics();
      } catch (error) {
        setError('Failed to delete expense');
        console.error('Error deleting expense:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-title">
            <h1>💰 Cost Optimization Analyzer</h1>
            <p>Track, analyze, and optimize your business expenses with MongoDB</p>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <nav className="tabs">
        <button 
          className={activeTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveTab('expenses')}
        >
          <span className="tab-icon">📋</span>
          <span className="tab-text">Expenses</span>
          {expenses.length > 0 && <span className="tab-badge">{expenses.length}</span>}
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => {
            setActiveTab('add');
            setEditingExpense(null);
          }}
        >
          <span className="tab-icon">{editingExpense ? '✏️' : '➕'}</span>
          <span className="tab-text">{editingExpense ? 'Edit Expense' : 'Add Expense'}</span>
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="tab-icon">📊</span>
          <span className="tab-text">Analytics</span>
          {analytics && <span className="tab-badge">📈</span>}
        </button>
      </nav>

      <main className="main-content">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {!loading && activeTab === 'expenses' && (
          <ExpenseList 
            expenses={expenses}
            onDelete={handleDeleteExpense}
            onEdit={handleEdit}
          />
        )}
        
        {!loading && activeTab === 'add' && (
          <ExpenseForm 
            onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            editingExpense={editingExpense}
            onCancel={() => {
              setEditingExpense(null);
              setActiveTab('expenses');
            }}
          />
        )}
        
        {!loading && activeTab === 'analytics' && analytics && (
          <Analytics analytics={analytics} expenses={expenses} />
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Cost Optimization Analyzer | MERN Stack with MongoDB</p>
      </footer>
    </div>
  );
}

export default App;