package com.example.demo.service;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.dto.AttendanceResponseDTO;
import com.example.demo.dto.AttendanceUpdateDTO;
import com.example.demo.exception.AttendanceAlreadyExistsException;
import com.example.demo.exception.AttendanceNotFoundException;
import com.example.demo.exception.EmployeeNotFoundException;
import com.example.demo.exception.NoAttendancesFoundException;
import com.example.demo.mapper.AttendanceMapper;
import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceMapper attendanceMapper;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository, AttendanceMapper attendanceMapper) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.attendanceMapper = attendanceMapper;
    }

    public AttendanceResponseDTO createAttendance(AttendanceCreateDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployee_id())
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + dto.getEmployee_id()));

        // Check if attendance already exists for this specific employee on this specific date
        if (attendanceRepository.findByEmployee_IdAndDate(dto.getEmployee_id(), dto.getDate()).isPresent()) {
            throw new AttendanceAlreadyExistsException("Attendance already exists for employee id: " + dto.getEmployee_id() + " on date: " + dto.getDate());
        }
        
        // Set overtime hours to 0 for certain statuses
        if (dto.getStatus() != null && 
            (dto.getStatus() == Attendance.AttendanceStatus.LEAVE || 
             dto.getStatus() == Attendance.AttendanceStatus.NO_PAY || 
             dto.getStatus() == Attendance.AttendanceStatus.HALF_DAY)) {
            dto.setOverTimeHours(0.0); // Set overtime hours to 0 for these statuses
        } else if (dto.getOverTimeHours() == null) {
            dto.setOverTimeHours(0.0); // Default to 0 if not provided
        }
        Attendance attendance = attendanceMapper.toEntity(dto, employee);
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return attendanceMapper.toResponseDTO(savedAttendance);
    }

    public List<AttendanceResponseDTO> getAttendanceByDate(LocalDate date) {
        List<Attendance> attendances = attendanceRepository.findByDate(date);
        if (attendances.isEmpty()) {
            throw new NoAttendancesFoundException("No attendance records found for date: " + date);
        }
        return attendances.stream()
                .map(attendanceMapper::toResponseDTO)
                .toList();
    }

    public AttendanceResponseDTO getAttendanceByEmployeeIdAndDate(String id, LocalDate date) {
        if (employeeRepository.findById(id).isEmpty()) {
            throw new EmployeeNotFoundException("Employee not found with id: " + id);
        }
        if (date == null) {
            throw new IllegalArgumentException("Date cannot be null");
        }
        Attendance attendance = attendanceRepository.findByEmployee_IdAndDate(id , date)
                .orElseThrow(() -> new NoAttendancesFoundException("Attendance not found for employee id: " + id + " on date: " + date));
        return attendanceMapper.toResponseDTO(attendance);
    }

    public List<AttendanceResponseDTO> getAttendanceByDateAndStatus(LocalDate date, Attendance.AttendanceStatus status) {
        if (date == null || status == null) {
            throw new IllegalArgumentException("Date and status cannot be null");
        }
        List<Attendance> attendances = attendanceRepository.findByDateAndStatus(date, status);
        if (attendances.isEmpty()) {
            throw new NoAttendancesFoundException("No attendance records found for date: " + date + " with status: " + status);
        }
        return attendances.stream()
                .map(attendanceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getAttendancesByDateAndDepartmentId(LocalDate date, String department_id) {
        if (date == null || department_id == null) {
            throw new IllegalArgumentException("Date and department Id cannot be null");
        }
        List<Attendance> attendances = attendanceRepository.findByDateAndDepartmentId(date, department_id);
        if (attendances.isEmpty()) {
            throw new NoAttendancesFoundException("No attendance records found for date: " + date + " with department: " + department_id);
        }
        return attendances.stream()
                .map(attendanceMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<AttendanceResponseDTO> getAttendanceByEmployeeIdAndDateRange(String id, LocalDate startDate, LocalDate endDate) {
        employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date cannot be null");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }
        List<Attendance> attendances = attendanceRepository.findByEmployee_IdAndDateBetween(id, startDate, endDate);
        if (attendances.isEmpty()) {
            throw new NoAttendancesFoundException("No attendance records found for employee id: " + id + " between " + startDate + " and " + endDate);
        }
        return attendances.stream()
                .map(attendanceMapper::toResponseDTO)
                .toList();
    }

    public AttendanceResponseDTO updateAttendance(Long id, AttendanceUpdateDTO dto) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new AttendanceNotFoundException("Attendance not found with id: " + id));
        
        if (dto.getStatus() != null){
            attendance.setStatus(dto.getStatus());
        }
        
        // Set overtime hours to 0 for certain statuses
        if (dto.getStatus() != null && 
            (dto.getStatus() == Attendance.AttendanceStatus.LEAVE || 
             dto.getStatus() == Attendance.AttendanceStatus.NO_PAY || 
             dto.getStatus() == Attendance.AttendanceStatus.HALF_DAY)) {
            attendance.setOverTimeHours(0.0);
        } else if (dto.getOverTimeHours() != null) {
            attendance.setOverTimeHours(dto.getOverTimeHours());
        }
        
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return attendanceMapper.toResponseDTO(savedAttendance);
    }


}
