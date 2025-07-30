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
  role: string;
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
    navigate(`/employee/${employeeId}`);
  };

  const handleEditEmployee = (employeeId: string) => {
    navigate(`/edit-employee/${employeeId}`);
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
    
    const matchesRole = filterRole === '' || employee.role === filterRole;
    
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

  const uniqueRoles = Array.from(new Set(employees.map(emp => emp.role).filter(Boolean)));

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
            <button onClick={handleBack} className="back-btn">
              ← Back
            </button>
            <h1>Employee Directory</h1>
            <button onClick={handleAddEmployee} className="add-btn">
              + Add Employee
            </button>
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
    </div>
  );
};

export default EmployeeList;
