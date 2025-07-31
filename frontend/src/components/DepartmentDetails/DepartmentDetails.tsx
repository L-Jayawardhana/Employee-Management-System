import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DepartmentDetails.css';

interface Department {
  id: string;
  name: string;
  salary: number;
  overTimeRate: number;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department_id: string;
}

const DepartmentDetails: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/department/getAll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const departmentList = Array.isArray(data) ? data : data.data || [];
        console.log('Fetched departments:', departmentList);
        setDepartments(departmentList);
      } else {
        setError('Failed to fetch departments');
      }
    } catch (error) {
      setError('Error fetching departments');
      console.error('Error:', error);
    }
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/api/v1/employee', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const employeeList = Array.isArray(data) ? data : data.data || [];
        console.log('Fetched employees:', employeeList);
        setEmployees(employeeList);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeesByDepartment = (departmentId: string) => {
    return employees.filter(emp => emp.department_id === departmentId);
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setSelectedDepartment(departmentId);
  };

  const filteredDepartments = selectedDepartment 
    ? departments.filter(dept => dept.id === selectedDepartment)
    : departments;

  return (
    <div className="department-details-page">
      <div className="department-details-container">
        <header className="page-header">
          <div className="header-left">
            <h1 className="page-title">Department Details</h1>
            <p className="page-subtitle">Manage and view all department information</p>
          </div>
          <div className="header-right">
            <select 
              value={selectedDepartment} 
              onChange={(e) => handleDepartmentFilter(e.target.value)}
              className="header-btn filter-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <button 
              onClick={() => navigate('/create-department')} 
              className="header-btn secondary-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Add Department
            </button>
          </div>
        </header>

        {loading && <p className="loading-message">Loading departments...</p>}
        {error && <div className="error-message">{error}</div>}

        <div className="departments-grid">
          {filteredDepartments.map(department => {
            const departmentEmployees = getEmployeesByDepartment(department.id);
            
            return (
              <div key={department.id} className="department-card small-card">
                <div className="department-card-header">
                  <h3>{department.name}</h3>
                </div>
                
                <div className="department-info">
                  <div className="info-item">
                    <span className="info-label">Employees:</span>
                    <span className="info-value">{departmentEmployees.length}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Base Salary:</span>
                    <span className="info-value">${department.salary?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Overtime Rate:</span>
                    <span className="info-value">${department.overTimeRate?.toFixed(2) || 'N/A'}/hr</span>
                  </div>
                </div>

                <div className="department-actions">
                  <button className="btn btn-secondary btn-sm">
                    Edit Department
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDepartments.length === 0 && !loading && (
          <div className="no-departments">
            <div className="no-departments-icon">🏢</div>
            <h3>No Departments Found</h3>
            <p>There are no departments to display. Use the "Add Department" button in the header to get started.</p>
          </div>
        )}

        <div className="bottom-actions">
          <button 
            onClick={() => navigate('/admin-dashboard')} 
            className="back-button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
