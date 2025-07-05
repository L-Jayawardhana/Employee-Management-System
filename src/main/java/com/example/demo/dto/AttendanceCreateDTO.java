package com.example.demo.dto;

import com.example.demo.model.Attendance;

import java.time.LocalDate;

public class AttendanceCreateDTO {
    private String employeeId;
    private LocalDate date;
    private Attendance.AttendanceStatus status;

    public String getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Attendance.AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
}
