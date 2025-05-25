package com.example.demo.controller;

import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.dto.AttendanceDTO;
import com.example.demo.model.Attendance;
import com.example.demo.service.AttendanceService;

@RestController
@RequestMapping(path = "api/v1/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<?> createAttendance(@RequestBody AttendanceCreateDTO attendanceCreateDTO) {
        try {
            Attendance saved = attendanceService.createAttendance(attendanceCreateDTO);
            AttendanceDTO dto = new AttendanceDTO(
                saved.getId(),
                saved.getEmployee().getId(),
                saved.getDate(),
                saved.getStatus().name()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllAttendances() {
        try {
            var attendances = attendanceService.getAllAttendances();
            var dtos = attendances.stream().map(a -> new AttendanceDTO(
                a.getId(),
                a.getEmployee().getId(),
                a.getDate(),
                a.getStatus().name()
            )).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/employee_Id/{id}")
    public ResponseEntity<?> getAttendanceByEmployeeId(@PathVariable String id) {
        try {
            var attendances = attendanceService.getAttendanceByEmployeeId(id);
            var dtos = attendances.stream().map(a -> new AttendanceDTO(
                a.getId(),
                a.getEmployee().getId(),
                a.getDate(),
                a.getStatus().name()
            )).collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
