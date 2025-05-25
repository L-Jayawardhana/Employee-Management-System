package com.example.demo.dto;

import java.time.LocalDate;

public class AttendanceCreateDTO {
    private String employeeId;
    private LocalDate date;
    private String status;

    public AttendanceCreateDTO() {}

    public AttendanceCreateDTO(String employeeId, LocalDate date, String status) {
        this.employeeId = employeeId;
        this.date = date;
        this.status = status;
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
