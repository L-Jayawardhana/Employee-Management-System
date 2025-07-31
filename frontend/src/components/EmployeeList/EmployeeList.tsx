import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  age: number;
  department_id: string;
  role: string | { name: string } | any;
  nic?: string; // May not be in DTO
  department?: {
    id: string;
    name: string;
  } | null;
  departmentName?: string;
  birthday?: string;
  dateOfBirth?: string;
  birthDate?: string;
  createdAt?: string;
}

interface Department {
  id: string;
  name: string;
}

interface EmployeeUpdateDTO {
  phone: string;
  email: string;
  address: string;
}

interface PasswordUpdateDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'byDepartment' | 'byId'>('all');
  const [searchEmployeeId, setSearchEmployeeId] = useState<string>('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [employeesPerPage] = useState<number>(10);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editForm, setEditForm] = useState<EmployeeUpdateDTO>({
    address: '',
    phone: '',
    email: ''
  });
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [employeeUpdateSuccess, setEmployeeUpdateSuccess] = useState<boolean>(false);
  
  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  
  // Password update state
  const [showPasswordSection, setShowPasswordSection] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState<PasswordUpdateDTO>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState<{[key: string]: string}>({});
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState<boolean>(false);

  // Helper function to get role display text
  const getRoleDisplayText = (role: any): string => {
    if (!role) return 'Not specified';
    if (typeof role === 'string') return role;
    if (typeof role === 'object' && role.name) return role.name;
    return String(role);
  };

  const fetchAllEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/v1/employee', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const employeeData = await response.json();
        const employeeList = Array.isArray(employeeData) ? employeeData : employeeData.data || [];
        console.log('Fetched employees:', employeeList.length > 0 ? employeeList[0] : 'No employees found');
        setEmployees(employeeList);
        setViewMode('all');
      } else if (response.status === 403) {
        setError('Access denied. You do not have permission to view employees.');
      } else {
        setError('Failed to load employees. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAllEmployees();
    fetchDepartments();
  }, [fetchAllEmployees]);

  const fetchEmployeeById = async (employeeId: string) => {
    if (!employeeId.trim()) {
      setError('Please enter an employee ID.');
      return;
    }

    try {
      setLoading(true);
      setError('');
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
        const employee = await response.json();
        setEmployees([employee]);
        setViewMode('byId');
      } else if (response.status === 404) {
        setError('Employee not found with the provided ID.');
        setEmployees([]);
      } else if (response.status === 403) {
        setError('Access denied. You do not have permission to view this employee.');
      } else {
        setError('Failed to load employee. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      setError('Failed to load employee. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesByDepartment = async (departmentId: string) => {
    if (!departmentId) {
      setError('Please select a department.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/employee/department/${departmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const employeeData = await response.json();
        const employeeList = Array.isArray(employeeData) ? employeeData : employeeData.data || [];
        setEmployees(employeeList);
        setViewMode('byDepartment');
      } else if (response.status === 404) {
        setError('No employees found in the selected department.');
        setEmployees([]);
      } else if (response.status === 403) {
        setError('Access denied. You do not have permission to view employees by department.');
      } else {
        setError('Failed to load employees by department. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching employees by department:', error);
      setError('Failed to load employees by department. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/v1/department/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const departmentData = await response.json();
        const departmentList = Array.isArray(departmentData) ? departmentData : departmentData.data || [];
        console.log('Fetched departments:', departmentList);
        setDepartments(departmentList);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleViewEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setViewingEmployee(employee);
      setIsViewModalOpen(true);
    }
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingEmployee(null);
  };

  const handleEditEmployee = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      openEditModal(employee);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/v1/employee/${employeeToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        // Remove the deleted employee from the list
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== employeeToDelete));
        setShowDeleteDialog(false);
        setEmployeeToDelete(null);
      } else if (response.status === 403) {
        setError('Access denied. You do not have permission to delete employees.');
      } else if (response.status === 404) {
        setError('Employee not found.');
      } else {
        setError('Failed to delete employee. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Failed to delete employee. Please check your connection.');
    }
  };

  const cancelDeleteEmployee = () => {
    setShowDeleteDialog(false);
    setEmployeeToDelete(null);
  };

  const handleAddEmployee = () => {
    navigate('/addEmployee');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSearchById = () => {
    fetchEmployeeById(searchEmployeeId);
  };

  const handleSearchByDepartment = () => {
    fetchEmployeesByDepartment(selectedDepartmentId);
  };

  const handleShowAllEmployees = () => {
    fetchAllEmployees();
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesRole = filterRole === '' || getRoleDisplayText(employee.role) === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, viewMode]);

  const uniqueRoles = Array.from(new Set(employees.map(emp => getRoleDisplayText(emp.role)).filter(Boolean)));

  // Edit employee functions
  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditForm({
      address: employee.address,
      phone: employee.phone,
      email: employee.email
    });
    setValidationErrors({});
    setEmployeeUpdateSuccess(false);
    setPasswordErrors({});
    setPasswordUpdateSuccess(false);
    setShowPasswordSection(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingEmployee(null);
    setEditForm({
      address: '',
      phone: '',
      email: ''
    });
    setValidationErrors({});
    setEmployeeUpdateSuccess(false);
    setPasswordErrors({});
    setPasswordUpdateSuccess(false);
    setShowPasswordSection(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const validateEmployeeForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!editForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(editForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!editForm.address.trim()) {
      errors.address = 'Address is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmployeeInputChange = (field: keyof EmployeeUpdateDTO, value: string | number) => {
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

  const handlePasswordInputChange = (field: keyof PasswordUpdateDTO, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Re-validate the entire form after updating the value
    setTimeout(() => {
      const updatedForm = { ...passwordForm, [field]: value };
      const errors: {[key: string]: string} = {};
      
      if (!updatedForm.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
      
      if (!updatedForm.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (updatedForm.newPassword.length < 8) {
        errors.newPassword = 'New password must be at least 8 characters';
      }
      
      if (updatedForm.newPassword !== updatedForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      
      if (updatedForm.currentPassword === updatedForm.newPassword && updatedForm.currentPassword && updatedForm.newPassword) {
        errors.newPassword = 'New password must be different from current password';
      }
      
      setPasswordErrors(errors);
    }, 0);
  };

  const updateEmployee = async () => {
    if (!validateEmployeeForm() || !editingEmployee) return;
    
    setIsUpdating(true);
    const token = localStorage.getItem('authToken');
    
    console.log('Updating employee:', editingEmployee.id);
    console.log('Update data:', editForm);
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/employee/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      console.log('Update response status:', response.status);
      console.log('Update response ok:', response.ok);

      if (response.ok) {
        // Update the employee in the local state with only the editable fields
        setEmployees(prev => prev.map(emp => 
          emp.id === editingEmployee.id 
            ? { 
                ...emp, 
                phone: editForm.phone,
                email: editForm.email,
                address: editForm.address
              }
            : emp
        ));
        
        setEmployeeUpdateSuccess(true);
        setError(''); // Clear any previous errors
        console.log('Employee updated successfully');
        
        // Auto-close modal after 1.5 seconds
        setTimeout(() => {
          setEmployeeUpdateSuccess(false);
          closeEditModal();
        }, 1500);
      } else {
        // Try to get error details from response
        let errorMessage = 'Failed to update employee';
        try {
          const errorData = await response.text();
          console.log('Error response:', errorData);
          errorMessage = `Failed to update employee: ${response.status} - ${errorData}`;
        } catch (e) {
          console.log('Could not parse error response');
        }
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Network error updating employee:', error);
      setError('Network error updating employee. Please check your connection.');
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async () => {
    if (!validatePasswordForm() || !editingEmployee) return;
    
    setIsUpdating(true);
    const token = localStorage.getItem('authToken');
    
    console.log('Attempting password update for employee:', editingEmployee.id);
    console.log('Password update data:', {
      currentPassword: passwordForm.currentPassword ? '[PROVIDED]' : '[EMPTY]',
      newPassword: passwordForm.newPassword ? '[PROVIDED]' : '[EMPTY]',
      confirmPassword: passwordForm.confirmPassword ? '[PROVIDED]' : '[EMPTY]'
    });
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/employee/change-password/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        })
      });

      console.log('Password update response status:', response.status);
      console.log('Password update response ok:', response.ok);

      if (response.ok) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordErrors({});
        setPasswordUpdateSuccess(true);
        console.log('Password updated successfully');
        
        // Auto-close modal after 1.5 seconds
        setTimeout(() => {
          setPasswordUpdateSuccess(false);
          closeEditModal();
        }, 1500);
      } else {
        // Try to get error details from response
        let errorMessage = 'Failed to update password.';
        try {
          const errorText = await response.text();
          console.log('Password update error response:', errorText);
          
          // Parse JSON error response if possible
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            errorData = { message: errorText };
          }
          
          if (response.status === 400) {
            // Validation error or invalid password
            errorMessage = errorData.message || 'Invalid password. Please check your current password.';
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized. Please check your credentials.';
          } else if (response.status === 403) {
            errorMessage = 'You do not have permission to change this password.';
          } else if (response.status === 404) {
            errorMessage = 'Employee not found.';
          } else {
            errorMessage = errorData.message || `Failed to update password: ${response.status}`;
          }
        } catch (e) {
          console.log('Could not parse password error response');
          errorMessage = `Failed to update password. Status: ${response.status}`;
        }
        setPasswordErrors({ currentPassword: errorMessage });
      }
    } catch (error) {
      console.error('Network error updating password:', error);
      setPasswordErrors({ currentPassword: 'Network error updating password. Please check your connection.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="employee-list-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-list-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Employees</h3>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={handleBack} className="btn btn-secondary">
              Go Back
            </button>
            <button onClick={handleShowAllEmployees} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-list-container">
      <div className="employee-list-wrapper">
        {/* Header */}
        <div className="list-header">
          <div className="header-content">
            <div className="header-title">
              <div className="title-text">
                <h1>Employee Directory</h1>
                <p className="header-subtitle">Manage and view all employee information</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handleBack} className="action-btn back-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Dashboard
              </button>
              <button onClick={handleAddEmployee} className="action-btn add-employee-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Add Employee
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="list-main">
          {/* Search Options */}
          <div className="search-options">
            <h3>Search Options</h3>
            <div className="search-methods">
              {/* Search by ID */}
              <div className="search-method">
                <label>Search by Employee ID:</label>
                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Enter employee ID..."
                    value={searchEmployeeId}
                    onChange={(e) => setSearchEmployeeId(e.target.value)}
                    className="search-input"
                  />
                  <button onClick={handleSearchById} className="search-btn">
                    Search
                  </button>
                </div>
              </div>

              {/* Search by Department */}
              <div className="search-method">
                <label>Search by Department:</label>
                <div className="search-input-group">
                  <select
                    value={selectedDepartmentId}
                    onChange={(e) => setSelectedDepartmentId(e.target.value)}
                    className="department-select"
                  >
                    <option value="">Select a department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <button onClick={handleSearchByDepartment} className="search-btn">
                    Search
                  </button>
                </div>
              </div>

              {/* Show All */}
              <div className="search-method">
                <button onClick={handleShowAllEmployees} className="show-all-btn">
                  Show All Employees
                </button>
              </div>
            </div>
          </div>

          {/* Current View Info */}
          <div className="view-info">
            <div className="view-status">
              {viewMode === 'all' && <span>📋 Showing all employees</span>}
              {viewMode === 'byId' && <span>🔍 Showing employee by ID: {searchEmployeeId}</span>}
              {viewMode === 'byDepartment' && (
                <span>🏢 Showing employees from: {departments.find(d => d.id === selectedDepartmentId)?.name}</span>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="filters-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Filter results by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-controls">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="filter-select"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Employee Count */}
          <div className="employee-count">
            <p>Showing {startIndex + 1}-{Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees (Page {currentPage} of {totalPages})</p>
          </div>

          {/* Employee Table */}
          {filteredEmployees.length === 0 ? (
            <div className="no-employees">
              <div className="no-employees-icon">👤</div>
              <h3>No Employees Found</h3>
              <p>No employees match your current search criteria.</p>
              <button onClick={handleShowAllEmployees} className="btn btn-primary">
                Show All Employees
              </button>
            </div>
          ) : (
            <div className="employee-table-container">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Employee ID</th>
                    <th>Address</th>
                    <th>Age</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEmployees.map(employee => (
                    <tr key={employee.id} className="employee-row">
                      <td className="employee-name">{employee.firstName}</td>
                      <td className="employee-id">{employee.id}</td>
                      <td className="employee-address">{employee.address}</td>
                      <td className="employee-age">{employee.age || 'Not provided'}</td>
                      <td className="employee-phone">{employee.phone}</td>
                      <td className="employee-actions">
                        <button 
                          onClick={() => handleViewEmployee(employee.id)}
                          className="btn btn-primary btn-sm view-btn"
                          title="View Employee Details"
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleEditEmployee(employee.id)}
                          className="btn btn-secondary btn-sm edit-btn"
                          title="Edit Employee"
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="btn btn-danger btn-sm delete-btn"
                          title="Delete Employee"
                        >
                          <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination">
                    <button 
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="pagination-btn prev-btn"
                    >
                      ← Previous
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        const isCurrentPage = page === currentPage;
                        const shouldShow = 
                          page === 1 || 
                          page === totalPages || 
                          (page >= currentPage - 2 && page <= currentPage + 2);
                        
                        if (!shouldShow) {
                          if (page === currentPage - 3 || page === currentPage + 3) {
                            return (
                              <span key={page} className="pagination-ellipsis">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`pagination-btn page-btn ${isCurrentPage ? 'active' : ''}`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="pagination-btn next-btn"
                    >
                      Next →
                    </button>
                  </div>
                  
                  <div className="pagination-info">
                    <span>Page {currentPage} of {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <div className="delete-dialog-header">
              <h3>Confirm Deletion</h3>
            </div>
            <div className="delete-dialog-body">
              <p>Are you sure you want to delete this employee?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="delete-dialog-actions">
              <button 
                onClick={cancelDeleteEmployee}
                className="btn btn-secondary cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteEmployee}
                className="btn btn-danger confirm-btn"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal employee-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Edit Employee
              </h2>
              <button className="close-btn" onClick={closeEditModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="employee-id-display">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Employee ID: {editingEmployee?.id}
                </h3>
              </div>

              <div className="form-tabs">
                <button 
                  className={`tab-btn ${!showPasswordSection ? 'active' : ''}`}
                  onClick={() => {
                    setShowPasswordSection(false);
                    setEmployeeUpdateSuccess(false);
                    setPasswordUpdateSuccess(false);
                    // Clear password form when switching away from password tab
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                >
                  Personal Information
                </button>
                <button 
                  className={`tab-btn ${showPasswordSection ? 'active' : ''}`}
                  onClick={() => {
                    setShowPasswordSection(true);
                    setEmployeeUpdateSuccess(false);
                    setPasswordUpdateSuccess(false);
                    // Ensure password form is clean when switching to password tab
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setPasswordErrors({});
                  }}
                >
                  Change Password
                </button>
              </div>

                  {!showPasswordSection ? (
                <div className="employee-form">
                  {employeeUpdateSuccess && (
                    <div className="success-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p>Employee information updated successfully! Your changes have been saved.</p>
                    </div>
                  )}
                  
                  {/* Read-only Employee Information */}
                  <div className="employee-info-section">
                    <h4>Employee Information (Read-only)</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Full Name:
                        </label>
                        <span>{editingEmployee?.firstName} {editingEmployee?.lastName}</span>
                      </div>
                      <div className="info-item">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Age:
                        </label>
                        <span>{editingEmployee?.age || 'Not provided'}</span>
                      </div>
                      <div className="info-item">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Role:
                        </label>
                        <span>{getRoleDisplayText(editingEmployee?.role)}</span>
                      </div>
                      <div className="info-item">
                        <label>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 21h18M5 21V7l8-4v18M19 21V9l-6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Department:
                        </label>
                        <span>{departments.find(dept => dept.id === editingEmployee?.department_id)?.name || 'Not assigned'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editable Fields */}
                  <div className="editable-section">
                    <h4>Editable Information</h4>                    <div className="form-group">
                      <label htmlFor="email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleEmployeeInputChange('email', e.target.value)}
                        className={`form-input ${validationErrors.email ? 'error' : ''}`}
                        placeholder="Enter email address"
                      />
                      {validationErrors.email && (
                        <span className="error-text">{validationErrors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Phone
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => handleEmployeeInputChange('phone', e.target.value)}
                        className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                        placeholder="Enter phone number"
                      />
                      {validationErrors.phone && (
                        <span className="error-text">{validationErrors.phone}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Address
                      </label>
                      <textarea
                        id="address"
                        value={editForm.address}
                        onChange={(e) => handleEmployeeInputChange('address', e.target.value)}
                        className={`form-input form-textarea ${validationErrors.address ? 'error' : ''}`}
                        placeholder="Enter address"
                        rows={3}
                      />
                      {validationErrors.address && (
                        <span className="error-text">{validationErrors.address}</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="password-form">
                  {passwordUpdateSuccess && (
                    <div className="success-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p>Password updated successfully! Your new password is now active.</p>
                    </div>
                  )}
                  
                  <div className="password-warning">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>Password changes require your current password for security verification.</p>
                    <p><strong>Security:</strong> Your new password must be at least 8 characters long and different from your current password.</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="current-password">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                      className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                      placeholder="Enter current password"
                      autoComplete="off"
                      autoFocus={false}
                    />
                    {passwordErrors.currentPassword && (
                      <span className="error-text">{passwordErrors.currentPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="new-password">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                      className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`}
                      placeholder="Enter new password (min 8 characters)"
                      autoComplete="new-password"
                    />
                    {passwordErrors.newPassword && (
                      <span className="error-text">{passwordErrors.newPassword}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirm-password">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 16l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                      className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    {passwordErrors.confirmPassword && (
                      <span className="error-text">{passwordErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={closeEditModal}
                className="btn-cancel"
                disabled={isUpdating}
              >
                Cancel
              </button>
              
              {!showPasswordSection ? (
                <button 
                  onClick={updateEmployee}
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
              ) : (
                <button 
                  onClick={updatePassword}
                  className="btn-save password-btn"
                  disabled={
                    isUpdating || 
                    !passwordForm.currentPassword || 
                    !passwordForm.newPassword || 
                    !passwordForm.confirmPassword ||
                    passwordForm.newPassword.length < 8 ||
                    passwordForm.newPassword !== passwordForm.confirmPassword ||
                    passwordForm.currentPassword === passwordForm.newPassword ||
                    Object.keys(passwordErrors).some(key => passwordErrors[key])
                  }
                >
                  {isUpdating ? (
                    <>
                      <div className="spinner"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 16l2 2l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Update Password
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {isViewModalOpen && (
        <div className="modal-overlay" onClick={closeViewModal}>
          <div className="view-modal employee-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
                Employee Details
              </h2>
              <button className="close-btn" onClick={closeViewModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="employee-id-display">
                <h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Employee ID: {viewingEmployee?.id}
                </h3>
              </div>

              <div className="employee-view-content">
                {/* Personal Information Section */}
                <div className="view-info-section">
                  <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Personal Information
                  </h4>
                  <div className="view-info-grid">
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        FULL NAME:
                      </label>
                      <span>{viewingEmployee?.firstName} {viewingEmployee?.lastName}</span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        AGE:
                      </label>
                      <span>{viewingEmployee?.age || 'Not provided'}</span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        PHONE:
                      </label>
                      <span>{viewingEmployee?.phone}</span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        NIC:
                      </label>
                      <span>{viewingEmployee?.nic || 'Not provided'}</span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        EMAIL:
                      </label>
                      <span>{viewingEmployee?.email}</span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        ADDRESS:
                      </label>
                      <span>{viewingEmployee?.address}</span>
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div className="view-info-section">
                  <h4>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Work Information
                  </h4>
                  <div className="view-info-grid">
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        ROLE:
                      </label>
                      <span className="role-badge">
                        {getRoleDisplayText(viewingEmployee?.role)}
                      </span>
                    </div>
                    <div className="view-info-item">
                      <label>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 21h18M5 21V7l8-4v18M19 21V9l-6-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        DEPARTMENT:
                      </label>
                      <span>{departments.find(dept => dept.id === viewingEmployee?.department_id)?.name || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={closeViewModal}
                className="btn-cancel"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  closeViewModal();
                  handleEditEmployee(viewingEmployee?.id || '');
                }}
                className="btn-save"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
