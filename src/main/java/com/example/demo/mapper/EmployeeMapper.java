package com.example.demo.mapper;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeCreateDTO dto, Department department, String hashedPassword) {
        Employee employee = new Employee();

        employee.setFirst_name(dto.getFirstName());
        employee.setLast_name(dto.getLastName());
        employee.setNic(dto.getNic());
        employee.setGender(dto.getGender());
        employee.setPhone(dto.getPhone());
        employee.setEmail(dto.getEmail());
        employee.setPassword(hashedPassword);
        if (dto.getBirthday() != null && !dto.getBirthday().isEmpty()) {
            employee.setBirthday(LocalDate.parse(dto.getBirthday()));
        }
        employee.setDepartment(department);

        return employee;
    }

    public EmployeeResponseDTO toResponseDTO(Employee savedEmployee) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(savedEmployee.getId());
        dto.setFirstName(savedEmployee.getFirst_name());
        dto.setLastName(savedEmployee.getLast_name());
        dto.setNic(savedEmployee.getNic());
        dto.setPhone(savedEmployee.getPhone());
        dto.setEmail(savedEmployee.getEmail());
        dto.setAge(savedEmployee.getAge());
        if (savedEmployee.getDepartment() != null) {
            dto.setDepartmentId(savedEmployee.getDepartment().getId());
        }
        return dto;
    }
}
