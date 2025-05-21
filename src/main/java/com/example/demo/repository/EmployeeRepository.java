package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("SELECT e FROM Employee e WHERE e.first_name = :first_name")
    List<Employee> findByFirst_name(@Param("first_name") String first_name);
    Optional<Employee> findByEmail(String email);
}
