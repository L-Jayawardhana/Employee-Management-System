package com.example.demo.dto;

import com.example.demo.model.Attendance;

public class AttendanceUpdateDTO {
    private Attendance.AttendanceStatus status;
    private Double overTimeHours;


    public Double getOverTimeHours() {
        return overTimeHours;
    }

    public void setOverTimeHours(Double overTimeHours) {
        this.overTimeHours = overTimeHours;
    }

    public Attendance.AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
}
