package com.example.demo.repository;

import com.example.demo.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByEmployee_Id(String employeeId);
    Optional<Attendance> findByEmployee_IdAndDate(String employeeId, LocalDate date);
    List<Attendance> findByDateAndStatus(LocalDate date, Attendance.AttendanceStatus status);
    List<Attendance> findByEmployee_IdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);
    List<Attendance> findByEmployee_IdAndDateBetweenAndStatus(String employeeId, LocalDate startDate, LocalDate endDate, Attendance.AttendanceStatus status);

    boolean existsByEmployee_Id(String empId);
    boolean existsByDate(LocalDate date);

    // Custom query to find attendance by date and department ID through employee relationship
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.employee.department.id = :departmentId")
    List<Attendance> findByDateAndDepartmentId(@Param("date") LocalDate date, @Param("departmentId") String departmentId);
}
