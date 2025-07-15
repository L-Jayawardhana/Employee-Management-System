package com.example.demo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Employee;
import com.example.demo.model.Salary;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long> {

    List<Salary> findByEmployee_Id(String id);

    // Custom query methods can be added here if needed
    // For example, to find salaries by employee ID or date range

    // Example:
    // List<Salary> findByEmployeeId(String employeeId);
    // List<Salary> findByDateBetween(LocalDate startDate, LocalDate endDate);

}
