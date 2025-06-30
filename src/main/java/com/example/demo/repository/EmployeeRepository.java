package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    @Query("SELECT e FROM Employee e WHERE e.first_name = :first_name")
    List<Employee> findByFirst_name(@Param("first_name") String first_name);

    Optional<Employee> findByEmail(String email);

    @Query("SELECT MAX(CAST(SUBSTRING(e.id, LENGTH(e.department.id) + 1) AS int)) FROM Employee e WHERE e.department = :department")
    Integer findMaxIdNumberByDepartment(@Param("department") Department department);

    List<Employee> findByDepartment_Id(String id);

    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
}

