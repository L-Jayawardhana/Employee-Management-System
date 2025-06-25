package com.example.demo.service;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.mapper.EmployeeMapper;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

        //hash password
        String HashedPassword = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt());

        //Use Mapper to convert DTO → Entity
        Employee employee = employeeMapper.toEntity(dto, department, HashedPassword);
        employee.setId(empId);

        //Save to DB
        Employee savedEmployee = employeeRepository.save(employee);

        //Convert Entity → DTO for response
        //This is not necessary, but it is a good practice to separate concerns.
        return employeeMapper.toResponseDTO(savedEmployee);
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return employees.stream()
                .map(employeeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDTO getEmployeeById(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found with id: " + id));
        return employeeMapper.toResponseDTO(employee);
    }

    public List<EmployeeResponseDTO> getEmployeesByDepartmentId(String departmentId) {
        List<Employee> employees = employeeRepository.findByDepartment_Id(departmentId);
        return employees.stream()
                .map(employeeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }
}
