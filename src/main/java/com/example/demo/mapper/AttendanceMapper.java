package com.example.demo.mapper;

import com.example.demo.dto.AttendanceCreateDTO;
import com.example.demo.dto.AttendanceResponseDTO;
import com.example.demo.model.Attendance;
import com.example.demo.model.Employee;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {
     public Attendance toEntity(AttendanceCreateDTO dto, Employee employee) {
        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDate(dto.getDate());
        attendance.setStatus(dto.getStatus());
        return attendance;
    }

     public AttendanceResponseDTO toResponseDTO(Attendance savedattendance) {
         AttendanceResponseDTO responseDTO = new AttendanceResponseDTO();
         responseDTO.setDate(savedattendance.getDate());
         responseDTO.setId(savedattendance.getId());
         responseDTO.setemployee_Id(savedattendance.getEmployee().getId());
         responseDTO.setStatus(savedattendance.getStatus().name());
         return responseDTO;
     }

}
