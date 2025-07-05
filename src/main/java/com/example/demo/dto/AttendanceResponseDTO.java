package com.example.demo.dto;

import java.time.LocalDate;

public class AttendanceResponseDTO {
    private Long id;
    private String employee_Id;
    private LocalDate date;
    private String status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getemployee_Id() {
        return employee_Id;
    }

    public void setemployee_Id(String employee_Id) {
        this.employee_Id = employee_Id;
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
