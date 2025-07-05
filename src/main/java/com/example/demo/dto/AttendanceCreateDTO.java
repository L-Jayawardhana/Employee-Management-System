package com.example.demo.dto;

import com.example.demo.model.Attendance;

import java.time.LocalDate;

public class AttendanceCreateDTO {
    private String employee_Id; // or Long employee_Id;
    private LocalDate date;
    private Attendance.AttendanceStatus status;

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

    public Attendance.AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
}
