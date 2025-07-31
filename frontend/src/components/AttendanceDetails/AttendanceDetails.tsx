import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceDetails.css';

interface Department {
  id: string;
  name: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  departmentId: string;
  status: string;
  date: string;
  employeeName?: string;
  departmentName?: string;
}

const AttendanceDetails: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendanceByDept, setAttendanceByDept] = useState<Record<string, AttendanceRecord[]>>({});
  const [statuses, setStatuses] = useState<string[]>(['PRESENT', 'NO_PAY', 'HALF_DAY', 'ABSENT']);
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [searchId, setSearchId] = useState('');
  const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [employeeAttendance, setEmployeeAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (departments.length > 0) {
      fetchAttendanceForAllDepartments(selectedDate);
    }
    // eslint-disable-next-line
  }, [departments, selectedDate]);

  const fetchDepartments = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch('http://localhost:8080/api/v1/department/getAll', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDepartments(Array.isArray(data) ? data : data.data || []);
    } catch (e) {
      setError('Failed to load departments');
    }
  };

  const fetchAttendanceForAllDepartments = async (date: string) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    const newAttendance: Record<string, AttendanceRecord[]> = {};
    
    for (const dept of departments) {
      try {
        // Use the new API endpoint to get all attendance for a department on a specific date
        const res = await fetch(`http://localhost:8080/api/v1/attendance/date/${date}/department/${dept.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 200) {
          const records = await res.json();
          const recordsArray = Array.isArray(records) ? records : (records.data && Array.isArray(records.data) ? records.data : []);
          
          // Fetch employee details for each attendance record
          const enrichedRecords = await Promise.all(
            recordsArray.map(async (record: any) => {
              try {
                // Fetch employee details
                const empRes = await fetch(`http://localhost:8080/api/v1/employee/${record.employeeId}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (empRes.status === 200) {
                  const empData = await empRes.json();
                  const employee = empData.data || empData;
                  
                  return {
                    ...record,
                    employeeName: employee.firstName && employee.lastName 
                      ? `${employee.firstName} ${employee.lastName}` 
                      : employee.name || record.employeeId,
                    departmentName: dept.name
                  };
                }
              } catch (e) {
                // If employee fetch fails, use the record as is
              }
              
              return {
                ...record,
                employeeName: record.employeeId,
                departmentName: dept.name
              };
            })
          );
          
          newAttendance[dept.id] = enrichedRecords;
        } else {
          // If no data found for this department, initialize empty array
          newAttendance[dept.id] = [];
        }
      } catch (e) {
        // If department fetch fails, initialize empty array
        newAttendance[dept.id] = [];
      }
    }
    
    setAttendanceByDept(newAttendance);
    setLoading(false);
  };

  const handleEmployeeSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmployeeAttendance(null);
    setError(null);
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/v1/attendance/employee/${searchId}/date=${searchDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.status === 200) {
        const data = await res.json();
        const attendanceRecord = Array.isArray(data) ? data[0] : data.data ? data.data[0] : data;
        
        if (attendanceRecord) {
          try {
            // Fetch employee details
            const empRes = await fetch(`http://localhost:8080/api/v1/employee/${searchId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (empRes.status === 200) {
              const empData = await empRes.json();
              const employee = empData.data || empData;
              
              // Fetch department name
              let departmentName = attendanceRecord.departmentId;
              const dept = departments.find(d => d.id === attendanceRecord.departmentId);
              if (dept) {
                departmentName = dept.name;
              }
              
              setEmployeeAttendance({
                ...attendanceRecord,
                employeeName: employee.firstName && employee.lastName 
                  ? `${employee.firstName} ${employee.lastName}` 
                  : employee.name || searchId,
                departmentName
              });
            } else {
              setEmployeeAttendance(attendanceRecord);
            }
          } catch (e) {
            setEmployeeAttendance(attendanceRecord);
          }
        }
      } else {
        setError('No attendance found for this employee and date.');
      }
    } catch (e) {
      setError('Failed to fetch employee attendance.');
    }
  };

  return (
    <div className="attendance-details-page">
      <div className="attendance-details-container">
        <div className="attendance-header">
          <h2>Attendance Details for {selectedDate}</h2>
          <div className="date-selector">
            <label>Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)} 
            />
          </div>
        </div>

        {loading && <p className="loading-message">Loading attendance...</p>}
        {error && <div className="error-message">{error}</div>}

        <div className="search-section">
          <h3>Find Employee Attendance by ID and Date</h3>
          <form onSubmit={handleEmployeeSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Employee ID" 
              value={searchId} 
              onChange={e => setSearchId(e.target.value)} 
              required 
              className="search-input"
            />
            <input 
              type="date" 
              value={searchDate} 
              onChange={e => setSearchDate(e.target.value)} 
              required 
              className="search-input"
            />
            <button type="submit" className="search-button">Search</button>
          </form>
          
          {employeeAttendance && (
            <div className="employee-result">
              <div className="employee-result-item">
                <span className="employee-result-label">Employee:</span>
                <span className="employee-result-value">{employeeAttendance.employeeName || employeeAttendance.employeeId}</span>
              </div>
              <div className="employee-result-item">
                <span className="employee-result-label">Date:</span>
                <span className="employee-result-value">{employeeAttendance.date}</span>
              </div>
              <div className="employee-result-item">
                <span className="employee-result-label">Status:</span>
                <span className="employee-result-value">{employeeAttendance.status}</span>
              </div>
              <div className="employee-result-item">
                <span className="employee-result-label">Department:</span>
                <span className="employee-result-value">{employeeAttendance.departmentName || employeeAttendance.departmentId}</span>
              </div>
            </div>
          )}
        </div>

        <div className="departments-grid">
          {departments.map(dept => (
            <div key={dept.id} className="department-card">
              <h3>{dept.name}</h3>
              {statuses.map(status => {
                const statusRecords = attendanceByDept[dept.id]?.filter(r => r.status === status) || [];
                return (
                  <div key={status} className={`status-section status-${status}`}>
                    <div className="status-header">
                      <span className="status-label">{status.replace('_', ' ')}:</span>
                      <span className="status-count">{statusRecords.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button onClick={() => navigate(-1)} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AttendanceDetails;
