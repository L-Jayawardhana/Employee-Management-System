package com.example.demo.controller;

import com.example.demo.dto.EmployeeCreateDTO;
import com.example.demo.dto.EmployeeResponseDTO;
import com.example.demo.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/employee")
public class EmployeeController {

    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody EmployeeCreateDTO dto) {
        try {
            EmployeeResponseDTO response = employeeService.addEmployee(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error adding employee: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllEmployees() {
        try{
            List<EmployeeResponseDTO> employees = employeeService.getAllEmployees();
            return ResponseEntity.status(HttpStatus.OK).body(employees);
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEmployeeById(@PathVariable String id) {
        try{
            EmployeeResponseDTO employee = employeeService.getEmployeeById(id);
            return ResponseEntity.status(HttpStatus.FOUND).body(employee);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Employee not found with id: " + id + e.getMessage());
        }
    }

    public ResponseEntity<?> getEmployeesByDepartmentId(@PathVariable String id) {
        try{
            List<EmployeeResponseDTO> employees = employeeService.getEmployeesByDepartmentId(id);
            return ResponseEntity.status(HttpStatus.FOUND).body(employees);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Department not found with id: " + id + e.getMessage());
        }
    }
}
