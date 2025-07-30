package com.example.demo.service;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.dto.EmployeeUpdateDTO;
import com.example.demo.exception.DepartmentNotFoundException;
import com.example.demo.exception.EmployeeAlreadyExistsException;
import com.example.demo.exception.EmployeeNotFoundException;
import com.example.demo.exception.NoEmployeesFoundException;
import com.example.demo.mapper.EmployeeMapper;
import com.example.demo.model.*;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.SalaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmployeeService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final SalaryRepository salaryRepository;
    private final AttendanceRepository attendanceRepository;
    private final EmployeeMapper employeeMapper;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository, 
                          SalaryRepository salaryRepository, AttendanceRepository attendanceRepository, 
                          EmployeeMapper employeeMapper) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.salaryRepository = salaryRepository;
        this.attendanceRepository = attendanceRepository;
        this.employeeMapper = employeeMapper;
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    public EmployeeResponseDTO addEmployee(EmployeeCreateDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new EmployeeAlreadyExistsException("Employee with email " + dto.getEmail() + " already exists");
        }
        if (employeeRepository.existsByNic(dto.getNic())) {
            throw new EmployeeAlreadyExistsException("Employee with NIC " + dto.getNic() + " already exists");
        }

        // Role-based authorization check
        validateRoleCreationPermission(dto.getRole());

        Department department = departmentRepository.findById(dto.getDepartment_id())
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id " + dto.getDepartment_id()));

        int nextNum = Optional.ofNullable(employeeRepository.findMaxIdNumberByDepartment(department)).orElse(0) + 1;
        String empId = department.getId() + nextNum;

        String HashedPassword = passwordEncoder.encode(dto.getPassword()); //hash password
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

    @Transactional
    public void deleteEmployee(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        
        // First, delete all salary records associated with this employee
        List<Salary> salaries = salaryRepository.findByEmployee_Id(id);
        if (!salaries.isEmpty()) {
            salaryRepository.deleteAll(salaries);
        }
        
        // Second, delete all attendance records associated with this employee
        List<Attendance> attendances = attendanceRepository.findByEmployee_Id(id);
        if (!attendances.isEmpty()) {
            attendanceRepository.deleteAll(attendances);
        }
        
        // Finally, delete the employee
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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return (UserDetails) employeeRepository.findByEmail(email)
                .orElseThrow(() -> new EmployeeNotFoundException("User not found: " + email));
    }

    /**
     * Validates if the current authenticated user has permission to create an employee with the specified role.
     * Rules:
     * - ADMIN users can create employees with any role (USER, HR, ADMIN)
     * - HR users can only create employees with USER role
     * - USER roles cannot create employees (handled by @PreAuthorize annotation)
     */
    private void validateRoleCreationPermission(Role targetRole) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("User is not authenticated");
        }

        // Get the current user's details
        String currentUserEmail = authentication.getName();
        Employee currentUser = employeeRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new EmployeeNotFoundException("Current user not found: " + currentUserEmail));

        Role currentUserRole = currentUser.getRole();

        // Validation logic
        if (currentUserRole == Role.ADMIN) {
            // ADMIN can create any role
            return;
        } else if (currentUserRole == Role.HR) {
            // HR can only create USER role employees
            if (targetRole != Role.USER) {
                throw new AccessDeniedException("HR users can only create employees with USER role. Cannot create: " + targetRole);
            }
        } else {
            // USER role should not reach here due to @PreAuthorize, but just in case
            throw new AccessDeniedException("Only ADMIN and HR users can create employees");
        }
    }


}
