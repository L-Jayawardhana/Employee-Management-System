package com.example.demo.mapper;

import org.springframework.stereotype.Component;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.dto.AttendanceResponseDTO;
import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;

@Component
public class AttendanceMapper {
     public Attendance toEntity(AttendanceCreateDTO dto, Employee employee) {
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(dto.getDate());
        // Convert String status to Enum
        attendance.setStatus(Attendance.AttendanceStatus.valueOf(dto.getStatus()));
        attendance.setOverTimeHours(dto.getOverTimeHours() != null ? dto.getOverTimeHours() : 0.0);
        return attendance;
    }

     public AttendanceResponseDTO toResponseDTO(Attendance savedattendance) {
         AttendanceResponseDTO responseDTO = new AttendanceResponseDTO();
         responseDTO.setDate(savedattendance.getDate());
         responseDTO.setId(savedattendance.getId());
         responseDTO.setEmployee_Id(savedattendance.getEmployee().getId());
         responseDTO.setStatus(savedattendance.getStatus().name());
         responseDTO.setOverTimeHours(savedattendance.getOverTimeHours());
         return responseDTO;
     }
}
