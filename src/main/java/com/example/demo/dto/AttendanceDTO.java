package com.example.demo.dto;

import java.time.LocalDate;

public class AttendanceDTO {
    private Long id;
    private String employeeId;
    private LocalDate date;
    private String status;

    public AttendanceDTO() {}

    public AttendanceDTO(Long id, String employeeId, LocalDate date, String status) {
        this.id = id;
        this.employeeId = employeeId;
        this.date = date;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
