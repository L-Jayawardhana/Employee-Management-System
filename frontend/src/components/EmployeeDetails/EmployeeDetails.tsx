import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EmployeeDetails.css';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  nic: string;
  address: string;
  gender: string;
  phone: string;
  email: string;
  birthday: string;
  department: {
    id: string;
    name: string;
  };
  role: string;
  createdAt: string;
  updatedAt: string;
}

const EmployeeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchEmployeeDetails(id);
    }
  }, [id]);

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/employee/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const employeeData = await response.json();
        setEmployee(employeeData);
      } else if (response.status === 404) {
        setError('Employee not found.');
      } else if (response.status === 403) {
        setError('Access denied. You do not have permission to view this employee.');
      } else {
        setError('Failed to load employee details. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError('Failed to load employee details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/edit-employee/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="employee-details-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading employee details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-details-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Employee Details</h3>
          <p>{error}</p>
          <button onClick={handleBack} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="employee-details-container">
        <div className="error-message">
          <h3>Employee Not Found</h3>
          <p>The requested employee could not be found.</p>
          <button onClick={handleBack} className="btn btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-details-container">
      <div className="employee-details-wrapper">
        {/* Header */}
        <div className="details-header">
          <div className="header-content">
            <button onClick={handleBack} className="back-btn">
              ← Back
            </button>
            <h1>Employee Details</h1>
            <button onClick={handleEdit} className="edit-btn">
              Edit Employee
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="details-main">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                </div>
              </div>
              <div className="profile-info">
                <h2>{employee.firstName} {employee.lastName}</h2>
                <div className="role-badge">{employee.role}</div>
                <div className="department-info">
                  <span className="department-label">Department:</span>
                  <span className="department-name">{employee.department.name}</span>
                </div>
                <div className="employee-id">Employee ID: {employee.id}</div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            {/* Personal Information */}
            <div className="details-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Full Name</label>
                  <span>{employee.firstName} {employee.lastName}</span>
                </div>
                <div className="info-item">
                  <label>NIC Number</label>
                  <span>{employee.nic}</span>
                </div>
                <div className="info-item">
                  <label>Gender</label>
                  <span>{employee.gender}</span>
                </div>
                <div className="info-item">
                  <label>Date of Birth</label>
                  <span>{formatDate(employee.birthday)} ({calculateAge(employee.birthday)} years old)</span>
                </div>
                <div className="info-item full-width">
                  <label>Address</label>
                  <span>{employee.address}</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="details-section">
              <h3 className="section-title">Contact Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email Address</label>
                  <span className="email-link">
                    <a href={`mailto:${employee.email}`}>{employee.email}</a>
                  </span>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <span className="phone-link">
                    <a href={`tel:${employee.phone}`}>{employee.phone}</a>
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="details-section">
              <h3 className="section-title">Employment Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Department</label>
                  <span>{employee.department.name}</span>
                </div>
                <div className="info-item">
                  <label>Role</label>
                  <span className="role-badge">{employee.role}</span>
                </div>
                <div className="info-item">
                  <label>Date Joined</label>
                  <span>{formatDate(employee.createdAt)}</span>
                </div>
                <div className="info-item">
                  <label>Last Updated</label>
                  <span>{formatDate(employee.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleBack} className="btn btn-secondary">
              Back to List
            </button>
            <button onClick={handleEdit} className="btn btn-primary">
              Edit Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
