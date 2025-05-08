package com.example.demo.employee;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public Employee addEmployee(Employee employee) {
        Optional<Employee> employeeByEmail = employeeRepository.findByEmail(employee.getEmail());
        if (employeeByEmail.isPresent()) {
            throw new IllegalStateException("Email already exists");
        }
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public void deleteEmployee(Long id) {
        boolean exists = employeeRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Employee with id " + id + " does not exist");
        }
        employeeRepository.deleteById(id);
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public List<Employee> getEmployeeByFirst_name(String first_name) {
        return employeeRepository.findByFirst_name(first_name);
    }

    public Employee updateEmployee(Long id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Employee with id " + id + " does not exist"));
        if (employee.getFirst_name() != null && !employee.getFirst_name().isEmpty()) {
            existingEmployee.setFirst_name(employee.getFirst_name());
        }
        if (employee.getLast_name() != null && !employee.getLast_name().isEmpty()) {
            existingEmployee.setLast_name(employee.getLast_name());
        }
        if (employee.getNic() != null && !employee.getNic().isEmpty()) {
            existingEmployee.setNic(employee.getNic());
        }
        if (employee.getAge() > 0) {
            existingEmployee.setAge(employee.getAge());
        }
        if (employee.getEmail() != null && !employee.getEmail().isEmpty()) {
            Optional<Employee> employeeByEmail = employeeRepository.findByEmail(employee.getEmail());
            if (employeeByEmail.isPresent() && employeeByEmail.get().getId() != id) {
                throw new IllegalStateException("Email already exists");
            }
            existingEmployee.setEmail(employee.getEmail());
        }
        if (employee.getPhone() != null && !employee.getPhone().isEmpty()) {
            existingEmployee.setPhone(employee.getPhone());
        }
        return employeeRepository.save(existingEmployee);
    }
}
