package com.example.demo.controller;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.dto.AttendanceResponseDTO;
import com.example.demo.dto.AttendanceUpdateDTO;
import com.example.demo.model.Attendance;
import com.example.demo.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }


    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<AttendanceResponseDTO> createAttendance(@RequestBody AttendanceCreateDTO dto) {
        AttendanceResponseDTO response = attendanceService.createAttendance(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    @GetMapping("/employee/{id}/date={date}")
    public ResponseEntity<AttendanceResponseDTO> getAttendanceByEmployeeIdAndDate(@PathVariable String id, @PathVariable LocalDate date) {
        AttendanceResponseDTO attendances = attendanceService.getAttendanceByEmployeeIdAndDate(id, date);
        return ResponseEntity.status(HttpStatus.OK).body(attendances);
    }

    @GetMapping("/date={date}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByDate(@PathVariable LocalDate date) {
        List<AttendanceResponseDTO> attendances = attendanceService.getAttendanceByDate(date);
        return ResponseEntity.status(HttpStatus.OK).body(attendances);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    @GetMapping("/date/{date}/status/{status}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByDateAndStatus(@PathVariable LocalDate date, @PathVariable Attendance.AttendanceStatus status) {
        List<AttendanceResponseDTO> attendances = attendanceService.getAttendanceByDateAndStatus(date, status);
        return ResponseEntity.status(HttpStatus.OK).body(attendances);
    }

    @GetMapping("/date/{date}/department/{department_id}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendancesByDateAndDepartmentId(@PathVariable LocalDate date, @PathVariable String department_id) {
        List<AttendanceResponseDTO> attendances = attendanceService.getAttendancesByDateAndDepartmentId(date, department_id);
        return ResponseEntity.status(HttpStatus.OK).body(attendances);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    @GetMapping("/employee/{id}/dateRange/startDate={startDate}/endDate={endDate}")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByEmployeeIdAndDateRange(
            @PathVariable String id,
            @PathVariable LocalDate startDate,
            @PathVariable LocalDate endDate) {
        List<AttendanceResponseDTO> attendances = attendanceService.getAttendanceByEmployeeIdAndDateRange(id, startDate, endDate);
        return ResponseEntity.status(HttpStatus.OK).body(attendances);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<AttendanceResponseDTO> updateAttendance(@PathVariable Long id, @RequestBody AttendanceUpdateDTO dto) {
        AttendanceResponseDTO updatedAttendance = attendanceService.updateAttendance(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedAttendance);
    }
}
