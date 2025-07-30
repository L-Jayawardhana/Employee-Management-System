import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to get token from localStorage first, or simulate admin login
    authenticateAndFetchData();
  }, []);

  const authenticateAndFetchData = async () => {
    // Check if we have a stored token from login
    let token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    
    // Verify user has admin role
    if (userRole !== 'ADMIN') {
      console.error('Access denied: User is not an admin');
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
      console.log('Fetching employee count with authentication...');
      const response = await fetch('http://localhost:8080/api/v1/employee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

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
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <div className="header-actions">
              <span className="welcome-text">Welcome, Administrator</span>
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
                <h3>Total Employees</h3>
                <p className="stat-number">
                  {loading ? 'Loading...' : error ? <span style={{color: 'red'}}>{error}</span> : totalEmployees}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>Departments</h3>
                <p className="stat-number">12</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Today's Attendance</h3>
                <p className="stat-number">142</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>Monthly Payroll</h3>
                <p className="stat-number">$45,200</p>
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
                  <p>Manage employee profiles</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">✏️</div>
                  <h4>Edit Employee</h4>
                  <p>Update employee information</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🗑️</div>
                  <h4>Remove Employee</h4>
                  <p>Deactivate employee accounts</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Department Management</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">🏗️</div>
                  <h4>Create Department</h4>
                  <p>Add new departments</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🏢</div>
                  <h4>View Departments</h4>
                  <p>Manage all departments</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📊</div>
                  <h4>Department Reports</h4>
                  <p>View department analytics</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">⚙️</div>
                  <h4>Department Settings</h4>
                  <p>Configure department details</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Attendance & Payroll</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">📋</div>
                  <h4>Attendance Records</h4>
                  <p>View all attendance data</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">💳</div>
                  <h4>Salary Management</h4>
                  <p>Manage employee salaries</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📈</div>
                  <h4>Payroll Reports</h4>
                  <p>Generate payroll reports</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🔍</div>
                  <h4>Audit Logs</h4>
                  <p>System activity logs</p>
                </button>
              </div>
            </div>

            <div className="dashboard-section">
              <h2>System Administration</h2>
              <div className="action-grid">
                <button className="action-card">
                  <div className="action-icon">👨‍💼</div>
                  <h4>User Roles</h4>
                  <p>Manage user permissions</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">🔒</div>
                  <h4>Security Settings</h4>
                  <p>Configure system security</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">💾</div>
                  <h4>Data Backup</h4>
                  <p>Backup system data</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">⚙️</div>
                  <h4>System Settings</h4>
                  <p>Configure application</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
