package com.example.demo.service;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeMapper;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository, EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.employeeMapper = employeeMapper;
    }

    public EmployeeResponseDTO addEmployee(EmployeeCreateDTO dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        int nextNum = Optional.ofNullable(employeeRepository.findMaxIdNumberByDepartment(department)).orElse(0) + 1;
        String empId = department.getId() + nextNum;

        //Use Mapper to convert DTO → Entity
        Employee employee = employeeMapper.toEntity(dto, department);
        employee.setId(empId);

        //Save to DB
        Employee savedEmployee = employeeRepository.save(employee);

        //Convert Entity → DTO for response
        //This is not necessary, but it is a good practice to separate concerns.
        return employeeMapper.toResponseDTO(savedEmployee);
    }

}
