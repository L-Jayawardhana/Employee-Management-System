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

interface DepartmentUpdateDTO {
  salary: number;
  overTimeRate: number;
}

const DepartmentDetails: React.FC = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editForm, setEditForm] = useState<DepartmentUpdateDTO>({
    salary: 0,
    overTimeRate: 0
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

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

  // Edit department functions
  const openEditModal = (department: Department) => {
    setEditingDepartment(department);
    setEditForm({
      salary: department.salary,
      overTimeRate: department.overTimeRate
    });
    setValidationErrors({});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingDepartment(null);
    setEditForm({ salary: 0, overTimeRate: 0 });
    setValidationErrors({});
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (editForm.salary <= 0) {
      errors.salary = 'Base salary must be greater than 0';
    } else if (editForm.salary > 1000000) {
      errors.salary = 'Base salary seems too high';
    }
    
    if (editForm.overTimeRate < 0) {
      errors.overTimeRate = 'Overtime rate cannot be negative';
    } else if (editForm.overTimeRate > 1000) {
      errors.overTimeRate = 'Overtime rate seems too high';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof DepartmentUpdateDTO, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const updateDepartment = async () => {
    if (!validateForm() || !editingDepartment) return;
    
    setIsUpdating(true);
    const token = localStorage.getItem('authToken');
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/department/update/${editingDepartment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        // Update the department in the local state
        setDepartments(prev => prev.map(dept => 
          dept.id === editingDepartment.id 
            ? { ...dept, ...editForm }
            : dept
        ));
        
        closeEditModal();
        // You could add a success notification here
      } else {
        setError('Failed to update department');
      }
    } catch (error) {
      setError('Error updating department');
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

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
                  <button 
                    onClick={() => openEditModal(department)}
                    className="btn btn-secondary btn-sm"
                  >
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

        {/* Edit Department Modal */}
        {isEditModalOpen && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Edit Department
                </h2>
                <button className="close-btn" onClick={closeEditModal}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="modal-body">
                <div className="department-name-display">
                  <h3>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {editingDepartment?.name}
                  </h3>
                  <p>Department name cannot be changed</p>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="base-salary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Base Salary ($)
                    </label>
                    <input
                      id="base-salary"
                      type="number"
                      value={editForm.salary}
                      onChange={(e) => handleInputChange('salary', parseFloat(e.target.value) || 0)}
                      className={`form-input ${validationErrors.salary ? 'error' : ''}`}
                      placeholder="Enter base salary"
                      min="0"
                      step="100"
                    />
                    {validationErrors.salary && (
                      <span className="error-text">{validationErrors.salary}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="overtime-rate">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Overtime Rate ($/hr)
                    </label>
                    <input
                      id="overtime-rate"
                      type="number"
                      value={editForm.overTimeRate}
                      onChange={(e) => handleInputChange('overTimeRate', parseFloat(e.target.value) || 0)}
                      className={`form-input ${validationErrors.overTimeRate ? 'error' : ''}`}
                      placeholder="Enter overtime rate"
                      min="0"
                      step="0.5"
                    />
                    {validationErrors.overTimeRate && (
                      <span className="error-text">{validationErrors.overTimeRate}</span>
                    )}
                  </div>
                </div>

                <div className="form-preview">
                  <h4>Preview</h4>
                  <div className="preview-card">
                    <div className="preview-header">
                      <h5>{editingDepartment?.name || 'Department Name'}</h5>
                    </div>
                    <div className="preview-info">
                      <div className="preview-item">
                        <span>Base Salary:</span>
                        <span>${editForm.salary?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="preview-item">
                        <span>Overtime Rate:</span>
                        <span>${editForm.overTimeRate?.toFixed(2) || '0.00'}/hr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  onClick={closeEditModal}
                  className="btn-cancel"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button 
                  onClick={updateDepartment}
                  className="btn-save"
                  disabled={isUpdating || Object.keys(validationErrors).length > 0}
                >
                  {isUpdating ? (
                    <>
                      <div className="spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentDetails;
