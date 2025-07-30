import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HRDashboard.css';

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get token from localStorage first, or simulate HR login
    authenticateAndFetchData();
  }, []);

  const authenticateAndFetchData = async () => {
    // Check if we have a stored token from login
    let token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    // Verify user has HR role
    if (userRole !== 'HR') {
      console.error('Access denied: User is not HR');
      navigate('/login');
      return;
    }
    
    if (token) {
      setAuthToken(token);
      await fetchEmployeeCount(token);
    } else {
      console.error('No authentication token found');
      navigate('/login');
    }
  };

  const fetchEmployeeCount = async (token: string) => {
    try {
      setError(null);
      console.log('Fetching employee count with HR authentication...');
      const response = await fetch('http://localhost:8080/api/v1/employee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Employee fetch response status:', response.status);
      console.log('Employee fetch response ok:', response.ok);

      const responseBody = await response.text();
      let employees;
      try {
        employees = JSON.parse(responseBody);
      } catch (e) {
        setError('Invalid JSON response from server.');
        setTotalEmployees(0);
        console.error('Invalid JSON:', responseBody);
        return;
      }

      if (response.ok) {
        // If the response is an array, use its length. If it's an object, try to find the array.
        let count = 0;
        if (Array.isArray(employees)) {
          count = employees.length;
        } else if (employees && Array.isArray(employees.data)) {
          count = employees.data.length;
        } else {
          setError('Unexpected response format.');
          console.error('Unexpected response format:', employees);
        }
        setTotalEmployees(count);
      } else {
        setError(`Failed to fetch employees. Status: ${response.status}`);
        console.error('Failed to fetch employees. Status:', response.status, responseBody);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed, clearing token and redirecting to login');
          localStorage.removeItem('authToken');
        }
        setTotalEmployees(0);
      }
    } catch (error) {
      setError('Error fetching employees. See console for details.');
      console.error('Error fetching employees:', error);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setAuthToken(null);
    navigate('/login');
  };

  return (
    <div className="hr-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>HR Dashboard</h1>
            <div className="header-actions">
              <span className="welcome-text">Welcome, HR Manager</span>
              <button onClick={handleLogout} className="btn btn-secondary logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>Active Employees</h3>
                <p className="stat-number">
                  {loading ? 'Loading...' : error ? <span style={{color: 'red'}}>{error}</span> : totalEmployees}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-info">
                <h3>Pending Applications</h3>
                <p className="stat-number">8</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Leave Requests</h3>
                <p className="stat-number">12</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>Present Today</h3>
                <p className="stat-number">142</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-section">
              <h2>Employee Management</h2>
              <div className="action-grid">
                <button className="action-card" onClick={() => navigate('/addEmployee')}>
                  <div className="action-icon">➕</div>
                  <h4>Add Employee</h4>
                  <p>Register new employees</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">👤</div>
                  <h4>View Employees</h4>
                  <p>Browse employee profiles</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">✏️</div>
                  <h4>Update Profiles</h4>
                  <p>Edit employee information</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">�</div>
                  <h4>Employee Reports</h4>
                  <p>Generate employee reports</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Attendance Management</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">📋</div>
                  <h4>Daily Attendance</h4>
                  <p>View today's attendance</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📅</div>
                  <h4>Monthly Reports</h4>
                  <p>Generate monthly reports</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">⏰</div>
                  <h4>Time Tracking</h4>
                  <p>Monitor working hours</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🚫</div>
                  <h4>Absence Management</h4>
                  <p>Handle leave requests</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Payroll & Benefits</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">💰</div>
                  <h4>Salary Records</h4>
                  <p>View employee salaries</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📈</div>
                  <h4>Payroll Processing</h4>
                  <p>Process monthly payroll</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🎁</div>
                  <h4>Benefits Management</h4>
                  <p>Manage employee benefits</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📋</div>
                  <h4>Payroll Reports</h4>
                  <p>Generate payroll reports</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Recruitment & Onboarding</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">📝</div>
                  <h4>Job Postings</h4>
                  <p>Manage job openings</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">👨‍💼</div>
                  <h4>Candidate Review</h4>
                  <p>Review applications</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🎯</div>
                  <h4>Onboarding</h4>
                  <p>New employee setup</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📞</div>
                  <h4>Interview Schedule</h4>
                  <p>Schedule interviews</p>
                </button>
              </div>
            </div>
          </div>

          <div className="recent-activities">
            <div className="activity-section">
              <h3>Recent Activities</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-details">
                    <p><strong>John Doe</strong> submitted leave request</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-details">
                    <p><strong>Payroll</strong> processed for March 2025</p>
                    <span className="activity-time">4 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">➕</div>
                  <div className="activity-details">
                    <p><strong>Jane Smith</strong> added to IT Department</p>
                    <span className="activity-time">1 day ago</span>
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

export default HRDashboard;
