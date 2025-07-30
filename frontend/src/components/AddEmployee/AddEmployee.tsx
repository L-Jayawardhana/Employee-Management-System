import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEmployee.css';

interface Department {
  id: string;
  name: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  nic: string;
  address: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthday: string;
  department_id: string;
  role: string;
}

const AddEmployee: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nic: '',
    address: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    department_id: '',
    role: 'USER'
  });
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [departmentsLoading, setDepartmentsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrors(['Authentication required. Please login again.']);
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/department/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const departmentData = await response.json();
        const deptList = Array.isArray(departmentData) ? departmentData : departmentData.data || [];
        setDepartments(deptList);
      } else {
        setErrors(['Failed to load departments. Please try again.']);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setErrors(['Failed to load departments. Please check your connection.']);
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Required field validation
    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');
    if (!formData.nic.trim()) newErrors.push('NIC is required');
    if (!formData.address.trim()) newErrors.push('Address is required');
    if (!formData.gender) newErrors.push('Gender is required');
    if (!formData.phone.trim()) newErrors.push('Phone number is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!formData.password) newErrors.push('Password is required');
    if (!formData.birthday) newErrors.push('Birthday is required');
    if (!formData.department_id) newErrors.push('Department is required');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.push('Please enter a valid phone number');
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    // NIC validation (Sri Lankan format)
    const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
    if (formData.nic && !nicRegex.test(formData.nic)) {
      newErrors.push('Please enter a valid NIC number');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrors(['Authentication required. Please login again.']);
        navigate('/login');
        return;
      }

      // Prepare the data according to EmployeeCreateDTO
      const employeeData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        nic: formData.nic.trim(),
        address: formData.address.trim(),
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        birthday: formData.birthday,
        department_id: formData.department_id,
        role: formData.role
      };

      const response = await fetch('http://localhost:8080/api/v1/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          firstName: '',
          lastName: '',
          nic: '',
          address: '',
          gender: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
          birthday: '',
          department_id: '',
          role: 'USER'
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 2000);
      } else {
        const errorData = await response.text();
        console.error('Server response:', errorData);
        setErrors([`Failed to create employee: ${response.status} ${response.statusText}`]);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrors(['Failed to create employee. Please check your connection and try again.']);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="add-employee-container">
      <div className="add-employee-wrapper">
        <div className="add-employee-header">
          <h1>Add New Employee</h1>
          <p>Fill in the details below to register a new employee</p>
        </div>

        <form onSubmit={handleSubmit} className="add-employee-form">
          {/* Success Message */}
          {success && (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <div>
                <h3>Employee Created Successfully!</h3>
                <p>Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="error-messages">
              <h4>Please fix the following errors:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
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
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nic">NIC Number *</label>
                <input
                  type="text"
                  id="nic"
                  name="nic"
                  value={formData.nic}
                  onChange={handleInputChange}
                  placeholder="e.g., 123456789V or 123456789012"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender *</label>
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="birthday">Date of Birth *</label>
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
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +94712345678"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="form-section">
            <h3 className="section-title">Employment Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department_id">Department *</label>
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
              <div className="form-group">
                <label htmlFor="role">Role *</label>
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
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3 className="section-title">Account Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (min 6 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || departmentsLoading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Employee...
                </>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
