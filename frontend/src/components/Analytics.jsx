import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';

function Analytics({ analytics, expenses }) {
  // Prepare data for charts
  const categoryData = Object.entries(analytics.categoryBreakdown || {})
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const monthlyData = analytics.monthlyTrend?.map(month => ({
    name: new Date(month._id.year, month._id.month - 1).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    expenses: month.total,
    count: month.count
  })) || [];

  const optimizableData = [
    { name: 'Optimizable', value: analytics.optimizableCount, color: '#4CAF50' },
    { name: 'Fixed', value: analytics.totalCount - analytics.optimizableCount, color: '#FF9800' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Cost Analytics & Optimization</h2>
        <div className="analytics-summary">
          <span>Total Records: {analytics.totalCount}</span>
          <span>•</span>
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-value">${analytics.totalExpenses?.toFixed(2) || '0.00'}</p>
            <span className="stat-count">{analytics.totalCount || 0} items</span>
          </div>
        </div>
        
        <div className="stat-card savings">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Potential Savings</h3>
            <p className="stat-value">${analytics.totalSavings?.toFixed(2) || '0.00'}</p>
            <span className="stat-count">Annual: ${((analytics.totalSavings || 0) * 12).toFixed(2)}</span>
          </div>
        </div>
        
        <div className="stat-card percentage">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Savings Percentage</h3>
            <p className="stat-value">{analytics.savingsPercentage || 0}%</p>
            <span className="stat-count">Of total expenses</span>
          </div>
        </div>
        
        <div className="stat-card count">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Optimizable Items</h3>
            <p className="stat-value">{analytics.optimizableCount || 0}</p>
            <span className="stat-count">Ready for optimization</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Category Distribution Pie Chart */}
        <div className="chart-container">
          <h3>💼 Expenses by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="chart-container">
          <h3>📅 Monthly Spending Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="expenses" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Optimizable vs Fixed Expenses */}
        <div className="chart-container">
          <h3>🔧 Optimization Potential</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={optimizableData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {optimizableData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar Chart */}
        <div className="chart-container">
          <h3>📊 Category Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-breakdown">
        <div className="category-breakdown">
          <h3>📋 Detailed Category Breakdown</h3>
          <div className="category-list">
            {categoryData.map((category, index) => {
              const percentage = ((category.value / analytics.totalExpenses) * 100).toFixed(1);
              return (
                <div key={category.name} className="category-item">
                  <div className="category-info">
                    <span className="category-name" style={{ color: COLORS[index % COLORS.length] }}>
                      {category.name}
                    </span>
                    <span className="category-amount">${category.value.toFixed(2)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                      title={`${percentage}%`}
                    ></div>
                  </div>
                  <span className="percentage">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="insights">
          <h3>💡 Optimization Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Focus Areas</h4>
                <p>Target the top 3 categories for maximum savings impact</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">💰</div>
              <div className="insight-content">
                <h4>Savings Potential</h4>
                <p>You could save ${analytics.totalSavings?.toFixed(2)} monthly</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">📈</div>
              <div className="insight-content">
                <h4>Efficiency Score</h4>
                <p>{analytics.savingsPercentage}% of expenses are optimizable</p>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Quick Wins</h4>
                <p>{analytics.optimizableCount} expenses ready for immediate optimization</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;