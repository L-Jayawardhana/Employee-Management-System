package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.dto.EmployeeUpdateDTO;
import com.example.demo.service.EmployeeService;

@RestController
@RequestMapping(path = "api/v1/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')") // Temporarily disabled for testing
    // In this ResponseEntity<?> also correct, but using a specific DTO type is better for clarity.
    public ResponseEntity<EmployeeResponseDTO> addEmployee(@RequestBody EmployeeCreateDTO dto) {
        EmployeeResponseDTO response = employeeService.addEmployee(dto);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {
        List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public int getAllEmployeesAsNo() {
        return employeeService.getAllEmployeesAsNo();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR') or hasRole('USER')")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable String id) {
        EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<List<EmployeeResponseDTO>> getEmployeesByDepartmentId(@PathVariable String departmentId) {
        List<EmployeeResponseDTO> employees = employeeService.getEmployeesByDepartmentId(departmentId);
        return ResponseEntity.ok(employees);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<EmployeeResponseDTO> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<EmployeeResponseDTO> updateEmployeeById(@PathVariable String id, @RequestBody EmployeeUpdateDTO dto) {
        EmployeeResponseDTO updatedEmployee = employeeService.updateEmployeeById(id, dto);
        return ResponseEntity.status(HttpStatus.OK).body(updatedEmployee);
    }
}
