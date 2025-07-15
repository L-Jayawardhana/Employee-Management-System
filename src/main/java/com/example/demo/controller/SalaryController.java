package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.SalaryCreateDTO;
import com.example.demo.dto.SalaryResponseDTO;
import com.example.demo.service.SalaryService;

@RestController
@RequestMapping(path = "api/v1/salary")
public class SalaryController {
    private final SalaryService salaryService;

    @Autowired
    public SalaryController(SalaryService salaryService) {
        this.salaryService = salaryService;
    }

    @PostMapping
    public ResponseEntity<SalaryResponseDTO> createSalary(@RequestBody SalaryCreateDTO dto) {
        SalaryResponseDTO response = salaryService.createSalary(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/employee/{id}")
    public ResponseEntity<List<SalaryResponseDTO>> getSalaryByEmployeeId(@PathVariable String id) {
        List<SalaryResponseDTO> salaries = salaryService.getSalaryByEmployeeId(id);
        return ResponseEntity.status(HttpStatus.OK).body(salaries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalaryResponseDTO> getSalaryById(@PathVariable long id) {
        SalaryResponseDTO salary = salaryService.getSalaryById(id);
        return ResponseEntity.status(HttpStatus.OK).body(salary);
    }
}
