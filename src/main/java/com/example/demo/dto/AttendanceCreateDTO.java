package com.example.demo.dto;

import java.time.LocalDate;
import com.example.demo.model.Attendance;

public class AttendanceCreateDTO {
    private String employee_id;
    private LocalDate date;
    private Attendance.AttendanceStatus status;
    private Double overTimeHours;

    public String getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(String employee_id) {
        this.employee_id = employee_id;
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

    public Attendance.AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
}
