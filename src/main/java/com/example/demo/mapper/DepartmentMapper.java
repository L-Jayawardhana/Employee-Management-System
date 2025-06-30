package com.example.demo.mapper;

import com.example.demo.dto.DepartmentCreateDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.model.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {
    public Department toEntity(DepartmentCreateDTO dto) {
        Department department = new Department();
        department.setName(dto.getName());
        department.setSalary(dto.getSalary());
        return department;
    }

    public DepartmentResponseDTO toResponseDto(Department savedDepartment) {
        DepartmentResponseDTO responseDTO = new DepartmentResponseDTO();
        responseDTO.setId(savedDepartment.getId());
        responseDTO.setName(savedDepartment.getName());
        responseDTO.setSalary(savedDepartment.getSalary());
        return responseDTO;
    }
}
