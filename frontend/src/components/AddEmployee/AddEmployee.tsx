import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css';

interface Department {
  id: string;
  name: string;
  salary: number;
  overTimeRate: number;
}

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  nic: string;
  address: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  birthday: string;
  department_id: string;
  role: string;
}

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    birthday: '',
    department_id: '',
    role: 'USER'
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    const authToken = localStorage.getItem('authToken');
    if (!authToken || userRole !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchDepartments(authToken);
  }, [navigate]);

  const fetchDepartments = async (token: string) => {
    try {
      setDepartmentsLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/department', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const departmentsData = await response.json();
        setDepartments(departmentsData);
      } else {
        setDepartments([]);
      }
    } catch (error) {
      setDepartments([]);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        navigate('/');
        return;
      }
      const response = await fetch('http://localhost:8080/api/v1/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess('Employee added successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          nic: '',
          address: '',
          gender: '',
          phone: '',
          email: '',
          password: '',
          birthday: '',
          department_id: '',
          role: 'USER'
        });
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 2000);
      } else {
        const errorData = await response.text();
        setError(`Failed to add employee: ${errorData}`);
      }
    } catch (error) {
      setError('Error adding employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="add-employee-hero-bg">
      <div className="add-employee-card">
        <div className="add-employee-header colorful-gradient">
          <h1>Register New Employee</h1>
          <button onClick={handleCancel} className="cancel-btn">
            Back to Dashboard
          </button>
        </div>
        <div className="add-employee-steps">
          <span className="step active">1</span>
          <span className="step">2</span>
          <span className="step">3</span>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <form onSubmit={handleSubmit} className="add-employee-form modern-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="Enter first name"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                placeholder="Enter last name"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="nic">NIC *</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
                required
                placeholder="Enter NIC number"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email address"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter phone number"
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <div className="select-wrapper">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="birthday">Birthday *</label>
              <input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="department_id">Department *</label>
              <div className="select-wrapper">
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  required
                  disabled={departmentsLoading}
                >
                  <option value="">
                    {departmentsLoading ? 'Loading departments...' : 'Select Department'}
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {departments.length === 0 && !departmentsLoading && (
                <small style={{ color: 'red', marginTop: '5px' }}>
                  No departments found. Please contact admin.
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="role">Role *</label>
              <div className="select-wrapper">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="USER">User</option>
                  <option value="HR">HR</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Enter password"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                minLength={6}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="Enter full address"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="form-actions modern-actions">
            <button
              type="submit"
              disabled={loading || departmentsLoading}
              className="modern-submit-btn"
              title="Register new employee to database"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <span className="btn-icon">🚀</span> Register Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
