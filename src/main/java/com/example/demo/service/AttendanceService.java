package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.EmployeeRepository;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
    }

    public Attendance createAttendance(AttendanceCreateDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployeeId())
            .orElseThrow(() -> new IllegalArgumentException("Employee not found: " + dto.getEmployeeId()));
        // Prevent duplicate attendance for same employee and date
        boolean exists = attendanceRepository.findByEmployee_Id(employee.getId())
            .stream().anyMatch(a -> a.getDate().equals(dto.getDate()));
        if (exists) {
            throw new IllegalStateException("Attendance for this employee on this date already exists");
        }
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(dto.getDate());
        attendance.setStatus(Enum.valueOf(com.example.demo.Enum.AttendanceStatus.class, dto.getStatus()));
        return attendanceRepository.save(attendance);
    }

    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByEmployeeId(String id) {
        return attendanceRepository.findByEmployee_Id(id);
    }
}
