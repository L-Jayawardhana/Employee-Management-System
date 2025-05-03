package com.example.demo.employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

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

    public List<Employee> getEmployeeByName(String name) {
        return employeeRepository.findByName(name);
    }

    public Employee updateEmployee(Long id, Employee employee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Employee with id " + id + " does not exist"));

        if (employee.getName() != null && !employee.getName().isEmpty()) {
            existingEmployee.setName(employee.getName());
        }
        if (employee.getEmail() != null && !employee.getEmail().isEmpty()) {
            existingEmployee.setEmail(employee.getEmail());
        }
        if (employee.getSalary() > 0) {
            existingEmployee.setSalary(employee.getSalary());
        }
        if (employee.getBirthday() != null) {
            existingEmployee.setBirthday(employee.getBirthday());
        }
        return employeeRepository.save(existingEmployee);
    }
}
