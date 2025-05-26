package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DepartmentCreateDTO;
import com.example.demo.dto.DepartmentDTO;
import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public DepartmentDTO addDepartment(DepartmentCreateDTO dto) {
        Department department = new Department();
        department.setName(dto.getName());
        department.setSalary(dto.getSalary());
        Department saved = departmentRepository.save(department);
        return toDTO(saved);
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<DepartmentDTO> getDepartmentById(String id) {
        boolean exists = departmentRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Department with id " + id + " does not exist");
        }
        return departmentRepository.findById(id).map(this::toDTO);
    }

    public void deleteDepartment(String id) {
        boolean exists = departmentRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Department with id " + id + " does not exist");
        }
        departmentRepository.deleteById(id);
    }

    public DepartmentDTO updateDepartment(String id, DepartmentCreateDTO dto) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Department with id " + id + " does not exist"));
        if (dto.getName() != null && !dto.getName().isEmpty()) {
            existingDepartment.setName(dto.getName());
        }
        if (dto.getSalary() > 0) {
            existingDepartment.setSalary(dto.getSalary());
        }
        Department saved = departmentRepository.save(existingDepartment);
        return toDTO(saved);
    }

    private DepartmentDTO toDTO(Department department) {
        return new DepartmentDTO(
            department.getId(),
            department.getName(),
            department.getSalary()
        );
    }
}
