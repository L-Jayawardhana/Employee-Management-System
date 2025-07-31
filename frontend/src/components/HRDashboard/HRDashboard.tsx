import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HRDashboard.css';

const HRDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalDepartments, setTotalDepartments] = useState<number>(0);
  const [todaysAttendance, setTodaysAttendance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [attendanceError, setAttendanceError] = useState<string | null>(null);

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
      await Promise.all([
        fetchEmployeeCount(token),
        fetchDepartmentCount(token),
        fetchTodaysAttendance(token)
      ]);
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

  const fetchDepartmentCount = async (token: string) => {
    try {
      setDepartmentError(null);
      console.log('Fetching department count with HR authentication...');
      const response = await fetch('http://localhost:8080/api/v1/department/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('HR Department response status:', response.status);
      console.log('HR Department response ok:', response.ok);

      const responseBody = await response.text();
      let departments;
      try {
        departments = JSON.parse(responseBody);
      } catch (e) {
        setDepartmentError('Invalid JSON response from server.');
        setTotalDepartments(0);
        console.error('Invalid JSON:', responseBody);
        return;
      }

      if (response.ok) {
        // If the response is an array, use its length. If it's an object, try to find the array.
        let count = 0;
        if (Array.isArray(departments)) {
          count = departments.length;
        } else if (departments && Array.isArray(departments.data)) {
          count = departments.data.length;
        } else {
          setDepartmentError('Unexpected response format.');
          console.error('Unexpected department response format:', departments);
        }
        setTotalDepartments(count);
      } else {
        setDepartmentError(`Failed to fetch departments. Status: ${response.status}`);
        console.error('Failed to fetch departments. Status:', response.status, responseBody);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed, clearing token and redirecting to login');
          localStorage.removeItem('authToken');
        }
        setTotalDepartments(0);
      }
    } catch (error) {
      setDepartmentError('Error fetching departments. See console for details.');
      console.error('Error fetching departments:', error);
      setTotalDepartments(0);
    }
  };

  const fetchTodaysAttendance = async (token: string) => {
    try {
      setAttendanceError(null);
      console.log("Fetching today's attendance with HR authentication...");
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`http://localhost:8080/api/v1/attendance/date/${today}/status/PRESENT`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      console.log("Today's attendance response status:", response.status);
      console.log("Today's attendance response ok:", response.ok);
      if (response.status === 204) {
        // No Content: no present employees
        setTodaysAttendance(0);
        return;
      }
      const responseBody = await response.text();
      if (!responseBody) {
        setTodaysAttendance(0);
        return;
      }
      let attendanceRecords;
      try {
        attendanceRecords = JSON.parse(responseBody);
      } catch (e) {
        setAttendanceError('Invalid JSON response from server.');
        setTodaysAttendance(0);
        console.error('Invalid JSON:', responseBody);
        return;
      }
      if (response.ok) {
        // If the response is an array, use its length
        let count = 0;
        if (Array.isArray(attendanceRecords)) {
          count = attendanceRecords.length;
        } else if (attendanceRecords && Array.isArray(attendanceRecords.data)) {
          count = attendanceRecords.data.length;
        } else {
          setAttendanceError('Unexpected response format.');
          console.error('Unexpected attendance response format:', attendanceRecords);
        }
        setTodaysAttendance(count);
        console.log(`Found ${count} employees present today (${today})`);
      } else {
        setAttendanceError(`Failed to fetch today's attendance. Status: ${response.status}`);
        console.error('Failed to fetch attendance. Status:', response.status, responseBody);
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed, clearing token and redirecting to login');
          localStorage.removeItem('authToken');
        }
        setTodaysAttendance(0);
      }
    } catch (error) {
      setAttendanceError("Error fetching today's attendance. See console for details.");
      console.error("Error fetching today's attendance:", error);
      setTodaysAttendance(0);
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
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <h3>Departments</h3>
                <p className="stat-number">
                  {loading ? 'Loading...' : departmentError ? <span style={{color: 'red'}}>{departmentError}</span> : totalDepartments}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <h3>Today's Attendance</h3>
                <p className="stat-number">
                  {loading ? 'Loading...' : attendanceError ? <span style={{color: 'red'}}>{attendanceError}</span> : todaysAttendance}
                </p>
                {!loading && !attendanceError && (
                  <a
                    href="#"
                    style={{
                      fontSize: '0.95rem',
                      opacity: 0.85,
                      color: '#059669',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      marginTop: '2px',
                      display: 'inline-block'
                    }}
                    onClick={e => {
                      e.preventDefault();
                      navigate('/attendance-details');
                    }}
                  >
                    More details
                  </a>
                )}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏰</div>
              <div className="stat-info">
                <h3>Leave Requests</h3>
                <p className="stat-number">12</p>
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
                <button className="action-card" onClick={() => navigate('/view-employees')}>
                  <div className="action-icon">👤</div>
                  <h4>View Employees</h4>
                  <p>Browse employee profiles</p>
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
