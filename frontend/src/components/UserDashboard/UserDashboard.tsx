import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const email = localStorage.getItem('userEmail');
    
    // Verify user has USER role
    if (userRole !== 'USER') {
      console.error('Access denied: User is not a regular user');
      navigate('/login');
      return;
    }
    
    if (!token) {
      console.error('No authentication token found');
      navigate('/login');
      return;
    }

    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>Employee Dashboard</h1>
            <div className="header-actions">
              <span className="welcome-text">Welcome, {userEmail || 'User'}</span>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder">JD</div>
              </div>
              <div className="profile-info">
                <h2>John Doe</h2>
                <p className="role">Software Developer</p>
                <p className="department">IT Department</p>
                <p className="employee-id">ID: EMP-2025-001</p>
              </div>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Days Present</h3>
                <p className="stat-number">22</p>
                <span className="stat-period">This Month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>Hours Worked</h3>
                <p className="stat-number">176</p>
                <span className="stat-period">This Month</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏖️</div>
              <div className="stat-info">
                <h3>Leave Balance</h3>
                <p className="stat-number">15</p>
                <span className="stat-period">Days Remaining</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Current Salary</h3>
                <p className="stat-number">$5,000</p>
                <span className="stat-period">Monthly</span>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">⏰</div>
                  <h4>Clock In/Out</h4>
                  <p>Mark your attendance</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📋</div>
                  <h4>View Attendance</h4>
                  <p>Check attendance history</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🏖️</div>
                  <h4>Request Leave</h4>
                  <p>Apply for time off</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">👤</div>
                  <h4>Update Profile</h4>
                  <p>Edit personal information</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Payroll Information</h2>
              <div className="payroll-grid">
                <div className="payroll-item">
                  <span className="payroll-label">Base Salary</span>
                  <span className="payroll-value">$5,000</span>
                </div>
                <div className="payroll-item">
                  <span className="payroll-label">Allowances</span>
                  <span className="payroll-value">$500</span>
                </div>
                <div className="payroll-item">
                  <span className="payroll-label">Deductions</span>
                  <span className="payroll-value">$150</span>
                </div>
                <div className="payroll-item total">
                  <span className="payroll-label">Net Salary</span>
                  <span className="payroll-value">$5,350</span>
                </div>
              </div>
              <button className="btn btn-primary view-payslip-btn">
                View Latest Payslip
              </button>
            </div>

            <div className="dashboard-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-details">
                    <p>Clocked in at 9:00 AM</p>
                    <span className="activity-time">Today</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🏖️</div>
                  <div className="activity-details">
                    <p>Leave request approved</p>
                    <span className="activity-time">2 days ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-details">
                    <p>Salary credited</p>
                    <span className="activity-time">1 week ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Department Info</h2>
              <div className="department-info">
                <div className="department-card">
                  <h3>IT Department</h3>
                  <div className="department-details">
                    <p><strong>Manager:</strong> Jane Smith</p>
                    <p><strong>Team Size:</strong> 12 members</p>
                    <p><strong>Location:</strong> Floor 3, Building A</p>
                    <p><strong>Contact:</strong> it@company.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
