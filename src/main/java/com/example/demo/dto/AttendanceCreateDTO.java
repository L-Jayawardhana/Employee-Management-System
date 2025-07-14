package com.example.demo.dto;

import java.time.LocalDate;

public class AttendanceCreateDTO {
    private String employee_Id;
    private LocalDate date;
    private String status;
    private Double overTimeHours;

    public String getEmployee_Id() {
        return employee_Id;
    }

    public void setEmployee_Id(String employee_Id) {
        this.employee_Id = employee_Id;
    }

    public Double getOverTimeHours() {
        return overTimeHours;
    }

    public void setOverTimeHours(Double overTimeHours) {
        this.overTimeHours = overTimeHours;
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
