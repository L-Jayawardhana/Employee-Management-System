package com.example.demo.service;

import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department addDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(String id) {
        boolean exists = departmentRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Department with id " + id + " does not exist");
        }
        return departmentRepository.findById(id);
    }

    public void deleteDepartment(String id) {
        boolean exists = departmentRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Department with id " + id + " does not exist");
        }
        departmentRepository.deleteById(id);
    }

    public Department updateDepartment(String id, Department department) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Department with id " + id + " does not exist"));
        if (department.getName() != null && !department.getName().isEmpty()) {
            existingDepartment.setName(department.getName());
        }
        if (department.getSalary() > 0) {
            existingDepartment.setSalary(department.getSalary());
        }
        return departmentRepository.save(existingDepartment);
    }
}
