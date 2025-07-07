package com.example.demo.repository;

import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    @Query("SELECT MAX(CAST(SUBSTRING(e.id, LENGTH(e.department.id) + 1) AS int)) FROM Employee e WHERE e.department = :department")
    Integer findMaxIdNumberByDepartment(@Param("department") Department department);

    List<Employee> findByDepartment_Id(String id);

    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
}

