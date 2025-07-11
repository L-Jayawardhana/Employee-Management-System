package com.example.demo.controller;

import com.example.demo.dto.DepartmentCreateDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.dto.DepartmentUpdateDTO;
import com.example.demo.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/v1/department")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> addDepartment(@RequestBody DepartmentCreateDTO dto) {
        DepartmentResponseDTO response = departmentService.addDepartment(dto);
        return ResponseEntity.status(201).body(response);
    }

    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getAllDepartments() {
        List<DepartmentResponseDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(@PathVariable String id) {
        DepartmentResponseDTO department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(department);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> deleteDepartment(@PathVariable String id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartmentResponseDTO> updateDepartment(@PathVariable String id, @RequestBody DepartmentUpdateDTO dto) {
        DepartmentResponseDTO updatedDepartment = departmentService.updateDepartment(id, dto);
        return ResponseEntity.ok(updatedDepartment);
    }

}
