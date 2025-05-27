package com.example.demo.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
    }

    public EmployeeDTO addEmployee(EmployeeCreateDTO dto) {
        // Find department
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found: " + dto.getDepartmentId()));

        // Generate employee ID based on department and sequence
        String deptId = department.getId();
        int nextNum = 1;
        Integer maxNum = employeeRepository.findMaxIdNumberByDepartment(department);
        if (maxNum != null) {
            nextNum = maxNum + 1;
        }
        String empId = deptId + nextNum;

        // Create Employee entity
        Employee employee = new Employee();
        employee.setId(empId);
        employee.setFirst_name(dto.getFirstName());
        employee.setLast_name(dto.getLastName());
        employee.setNic(dto.getNic());
        employee.setGender(dto.getGender());
        employee.setPhone(dto.getPhone());
        employee.setEmail(dto.getEmail());
        employee.setPassword(org.mindrot.jbcrypt.BCrypt.hashpw(dto.getPassword(), org.mindrot.jbcrypt.BCrypt.gensalt()));
        if (dto.getBirthday() != null && !dto.getBirthday().isEmpty()) {
            employee.setBirthday(LocalDate.parse(dto.getBirthday()));
        }
        employee.setDepartment(department);

        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<EmployeeDTO> getEmployeeById(String id) {
        return employeeRepository.findById(id).map(this::toDTO);
    }

    public List<EmployeeDTO> getEmployeeByFirst_name(String first_name) {
        return employeeRepository.findByFirst_name(first_name).stream().map(this::toDTO).collect(Collectors.toList());
    }


    public List<EmployeeDTO> getEmployeesByDepartmentId(String departmentId) {
        return employeeRepository.findByDepartment_Id(departmentId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public void deleteEmployee(String id) {
        boolean exists = employeeRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Employee with id " + id + " does not exist");
        }
        employeeRepository.deleteById(id);
        System.out.println("Employee with id " + id + " deleted successfully.");
    }

    public EmployeeDTO updateEmployee(String id, EmployeeCreateDTO dto) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Employee with id " + id + " does not exist"));
        if (dto.getFirstName() != null && !dto.getFirstName().isEmpty()) {
            existingEmployee.setFirst_name(dto.getFirstName());
        }
        if (dto.getLastName() != null && !dto.getLastName().isEmpty()) {
            existingEmployee.setLast_name(dto.getLastName());
        }
        if (dto.getNic() != null && !dto.getNic().isEmpty()) {
            existingEmployee.setNic(dto.getNic());
        }
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            Optional<Employee> employeeByEmail = employeeRepository.findByEmail(dto.getEmail());
            if (employeeByEmail.isPresent() && !employeeByEmail.get().getId().equals(id)) {
                throw new IllegalStateException("Email already exists");
            }
            existingEmployee.setEmail(dto.getEmail());
        }
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            existingEmployee.setPassword(org.mindrot.jbcrypt.BCrypt.hashpw(dto.getPassword(), org.mindrot.jbcrypt.BCrypt.gensalt()));
        }
        if (dto.getPhone() != null && !dto.getPhone().isEmpty()) {
            existingEmployee.setPhone(dto.getPhone());
        }
        if (dto.getBirthday() != null && !dto.getBirthday().isEmpty()) {
            existingEmployee.setBirthday(LocalDate.parse(dto.getBirthday()));
        }
        if (dto.getDepartmentId() != null && !dto.getDepartmentId().isEmpty()) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found: " + dto.getDepartmentId()));
            existingEmployee.setDepartment(department);
        }
        Employee saved = employeeRepository.save(existingEmployee);
        return toDTO(saved);
    }

    private EmployeeDTO toDTO(Employee employee) {
        return new EmployeeDTO(
            employee.getId(),
            employee.getFirst_name(),
            employee.getLast_name(),
            employee.getNic(),
            employee.getGender(),
            employee.getPhone(),
            employee.getEmail(),
            employee.getAge(),
            employee.getDepartment().getId(),
            employee.getDepartment().getName()
        );
    }



}
