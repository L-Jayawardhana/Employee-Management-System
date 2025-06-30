package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.demo.exception.DepartmentNotFoundException;
import com.example.demo.exception.EmployeeAlreadyExistsException;
import com.example.demo.exception.EmployeeNotFoundException;
import com.example.demo.exception.NoEmployeesFoundException;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.dto.EmployeeUpdateDTO;
import com.example.demo.mapper.EmployeeMapper;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;

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
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new EmployeeAlreadyExistsException("Employee with email " + dto.getEmail() + " already exists");
        }
        if (employeeRepository.existsByNic(dto.getNic())) {
            throw new EmployeeAlreadyExistsException("Employee with NIC " + dto.getNic() + " already exists");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id " + dto.getDepartmentId()));

        int nextNum = Optional.ofNullable(employeeRepository.findMaxIdNumberByDepartment(department)).orElse(0) + 1;
        String empId = department.getId() + nextNum;

        String HashedPassword = BCrypt.hashpw(dto.getPassword(), BCrypt.gensalt()); //hash password
        int age = LocalDate.now().getYear() - (dto.getBirthday()).getYear();
        //Use Mapper to convert DTO → Entity
        Employee employee = employeeMapper.toEntity(dto, department, HashedPassword, age);
        employee.setId(empId);// manually add id

        //Save to DB
        Employee savedEmployee = employeeRepository.save(employee);

        //Convert Entity → DTO for response
        //This is not necessary, but it is a good practice to separate concerns.
        return employeeMapper.toResponseDTO(savedEmployee);
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) {
            throw new NoEmployeesFoundException("No employees found in the system" );
        }
        return employees.stream()
                .map(employeeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EmployeeResponseDTO getEmployeeById(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        return employeeMapper.toResponseDTO(employee);
    }

    public List<EmployeeResponseDTO> getEmployeesByDepartmentId(String departmentId) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + departmentId));
        List<Employee> employees = employeeRepository.findByDepartment_Id(departmentId);
        if(employees.isEmpty()) {
            throw new NoEmployeesFoundException("No employees found in the department with id: " + departmentId);
        }
        return employees.stream()
                .map(employeeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public void deleteEmployee(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    public EmployeeResponseDTO updateEmployeeById(String id, EmployeeUpdateDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));

        if (dto.getPhone() != null) {
            employee.setPhone(dto.getPhone());
        }
        if (dto.getEmail() != null) {
            employee.setEmail(dto.getEmail());
        }
        if (dto.getAddress() != null) {
            employee.setAddress(dto.getAddress());
        }
        Employee updatedEmployee = employeeRepository.save(employee);
        return employeeMapper.toResponseDTO(updatedEmployee);
    }
}
