package com.example.demo.service;

import com.example.demo.dto.DepartmentCreateDTO;
import com.example.demo.dto.DepartmentResponseDTO;
import com.example.demo.dto.DepartmentUpdateDTO;
import com.example.demo.exception.DepartmentAlreadyExistsException;
import com.example.demo.exception.DepartmentNotFoundException;
import com.example.demo.exception.NoDepartmentsFoundException;
import com.example.demo.mapper.DepartmentMapper;
import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository, DepartmentMapper departmentMapper) {
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
    }

    public DepartmentResponseDTO addDepartment(DepartmentCreateDTO dto) {
        String id = dto.getName().toUpperCase().substring(0, Math.min(dto.getName().length(), 4));
        if(departmentRepository.existsById(id)) {
            throw new DepartmentAlreadyExistsException("Department with id " + id + " already exists");
        }
        Department department = departmentMapper.toEntity(dto);
        department.setId(id); // Manually set the ID

        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toResponseDTO(savedDepartment);
    }

    public List<DepartmentResponseDTO> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        if (departments.isEmpty()) {
            throw new NoDepartmentsFoundException("No departments found in system");
        }
        return departments.stream()
                .map(departmentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public DepartmentResponseDTO getDepartmentById(String id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist"));
        return departmentMapper.toResponseDTO(department);
    }

    public void deleteDepartment(String id) {
        departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist"));
        departmentRepository.deleteById(id);
    }

    public DepartmentResponseDTO updateDepartment(String id, DepartmentUpdateDTO dto) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new DepartmentNotFoundException("Department with id " + id + " does not exist"));
        if (dto.getSalary() > 0) {
            existingDepartment.setSalary(dto.getSalary());
        }
        Department saved = departmentRepository.save(existingDepartment);
        return departmentMapper.toResponseDTO(saved);
    }

}
