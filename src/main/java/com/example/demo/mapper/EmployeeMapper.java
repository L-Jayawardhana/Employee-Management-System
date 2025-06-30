package com.example.demo.mapper;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public Employee toEntity(EmployeeCreateDTO dto, Department department, String hashedPassword, int age) {
        Employee employee = new Employee();

        employee.setFirst_name(dto.getFirstName());
        employee.setLast_name(dto.getLastName());
        employee.setNic(dto.getNic());
        employee.setAddress(dto.getAddress());
        employee.setGender(dto.getGender());
        employee.setPhone(dto.getPhone());
        employee.setEmail(dto.getEmail());
        employee.setPassword(hashedPassword);
        employee.setAge(age);
        employee.setBirthday(dto.getBirthday());
        employee.setDepartment(department);

        return employee;
    }

    public EmployeeResponseDTO toResponseDTO(Employee savedEmployee) {
        EmployeeResponseDTO responseDto = new EmployeeResponseDTO();
        responseDto.setId(savedEmployee.getId());
        responseDto.setFirstName(savedEmployee.getFirst_name());
        responseDto.setLastName(savedEmployee.getLast_name());
        responseDto.setAddress(savedEmployee.getAddress());
        responseDto.setPhone(savedEmployee.getPhone());
        responseDto.setEmail(savedEmployee.getEmail());
        responseDto.setAge(savedEmployee.getAge());
        responseDto.setDepartmentId(savedEmployee.getDepartment().getId());
        return responseDto;
    }
}
