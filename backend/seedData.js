import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Expense from './models/Expense.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleExpenses = [
  {
    category: 'Cloud Services',
    description: 'AWS EC2 Instances - Production Environment',
    amount: 450.00,
    date: new Date('2025-01-15'),
    optimizable: true,
    savings: 120.00
  },
  {
    category: 'Software Licenses',
    description: 'Adobe Creative Cloud Team License',
    amount: 299.99,
    date: new Date('2025-01-20'),
    optimizable: true,
    savings: 50.00
  },
  {
    category: 'Marketing',
    description: 'Google Ads Campaign - Q1',
    amount: 800.00,
    date: new Date('2025-01-25'),
    optimizable: true,
    savings: 150.00
  },
  {
    category: 'Operations',
    description: 'Office Rent - January',
    amount: 2500.00,
    date: new Date('2025-01-01'),
    optimizable: false,
    savings: 0
  },
  {
    category: 'Software Licenses',
    description: 'Microsoft 365 Business Premium',
    amount: 199.00,
    date: new Date('2025-01-10'),
    optimizable: true,
    savings: 30.00
  },
  {
    category: 'Cloud Services',
    description: 'Azure Storage and Backup',
    amount: 275.50,
    date: new Date('2025-01-18'),
    optimizable: true,
    savings: 80.00
  },
  {
    category: 'Human Resources',
    description: 'Employee Training Program',
    amount: 1500.00,
    date: new Date('2025-01-22'),
    optimizable: false,
    savings: 0
  },
  {
    category: 'Marketing',
    description: 'Social Media Advertising',
    amount: 350.00,
    date: new Date('2025-01-28'),
    optimizable: true,
    savings: 75.00
  },
  {
    category: 'Office Supplies',
    description: 'Stationery and Equipment',
    amount: 180.00,
    date: new Date('2025-01-12'),
    optimizable: true,
    savings: 25.00
  },
  {
    category: 'Travel',
    description: 'Client Meeting - Business Trip',
    amount: 650.00,
    date: new Date('2025-01-30'),
    optimizable: true,
    savings: 100.00
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Expense.deleteMany({});
    console.log('🗑️  Existing data cleared');
    
    // Insert sample data
    await Expense.insertMany(sampleExpenses);
    console.log('✅ Sample data inserted successfully');
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();