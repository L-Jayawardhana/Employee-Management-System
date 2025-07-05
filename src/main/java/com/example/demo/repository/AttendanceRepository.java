package com.example.demo.repository;

import com.example.demo.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByEmployee_IdAndDate(String employeeId, LocalDate date);
    List<Attendance> findByDateAndStatus(LocalDate date, Attendance.AttendanceStatus status);
    List<Attendance> id(Long id);
    List<Attendance> findByEmployee_IdAndDateBetween(String employeeId, LocalDate startDate, LocalDate endDate);

    boolean existsByEmployee_Id(String empId);
    boolean existsByDate(LocalDate date);
}
