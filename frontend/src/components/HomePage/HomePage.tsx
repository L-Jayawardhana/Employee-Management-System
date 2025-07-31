import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div className="container">
        <header className="header">
          <h1 className="logo">Employee Management System</h1>
        </header>
        
        <main className="main-content">
          <div className="hero-section">
            <div className="hero-content">
              <h2 className="hero-title">
                Welcome to Employee Management System
              </h2>
              <p className="hero-description">
                Streamline your workforce management with our comprehensive solution. 
                Manage employees, departments, attendance, and payroll all in one place.
              </p>
              
              <div className="action-buttons">
                <Link to="/login" className="btn btn-primary">
                  Login
                </Link>
              </div>
            </div>
            
            <div className="hero-image">
              <div className="placeholder-image">
                <div className="image-content">
                  <h3>Professional</h3>
                  <h3>Employee</h3>
                  <h3>Management</h3>
                </div>
              </div>
            </div>
          </div>
          
          <div className="features-section">
            <h3 className="features-title">Key Features</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h4>Employee Management</h4>
                <p>Manage employee profiles, roles, and information</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏢</div>
                <h4>Department Management</h4>
                <p>Organize and structure your departments efficiently</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📅</div>
                <h4>Attendance Tracking</h4>
                <p>Monitor and track employee attendance and working hours</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h4>Salary Management</h4>
                <p>Handle payroll and salary calculations seamlessly</p>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="footer">
          <p>&copy; 2025 Employee Management System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
