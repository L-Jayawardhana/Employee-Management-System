import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateDepartment.css';

interface DepartmentCreateDTO {
  name: string;
  salary: number;
  overTimeRate: number;
}

const CreateDepartment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DepartmentCreateDTO>({
    name: '',
    salary: 0,
    overTimeRate: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : Number(value)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Department name is required');
      return false;
    }
    if (formData.salary <= 0) {
      setError('Salary must be greater than 0');
      return false;
    }
    if (formData.overTimeRate < 0) {
      setError('Overtime rate cannot be negative');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/department/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess('Department created successfully!');
        console.log('Department created:', responseData);
        
        // Reset form
        setFormData({
          name: '',
          salary: 0,
          overTimeRate: 0
        });
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin-dashboard');
        }, 2000);
      } else {
        const errorText = await response.text();
        setError(`Failed to create department: ${errorText || response.statusText}`);
        
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication failed, redirecting to login');
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Error creating department:', error);
      setError('An error occurred while creating the department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="create-department">
      <div className="create-department-wrapper">
        <div className="department-header">
          <h2>Create New Department</h2>
          <button onClick={handleCancel} className="action-btn back-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Dashboard
          </button>
        </div>

      <main className="department-main">
        <div className="container">
          <div className="form-container">
            <div className="form-card">
              <h2>Department Details</h2>
              
              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="department-form">
                <div className="form-group">
                  <label htmlFor="name">Department Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter department name"
                    required
                    disabled={loading}
                  />
                  <small>Enter a unique name for the department</small>
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Base Salary *</label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Enter base salary"
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                  <small>Base salary amount for this department</small>
                </div>

                <div className="form-group">
                  <label htmlFor="overTimeRate">Overtime Rate (%)</label>
                  <input
                    type="number"
                    id="overTimeRate"
                    name="overTimeRate"
                    value={formData.overTimeRate}
                    onChange={handleInputChange}
                    placeholder="Enter overtime rate percentage"
                    min="0"
                    step="0.01"
                    disabled={loading}
                  />
                  <small>Overtime rate percentage</small>
                </div>

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
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
};

export default CreateDepartment;
