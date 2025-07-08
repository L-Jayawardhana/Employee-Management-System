package com.example.demo.dto;

import com.example.demo.model.Attendance;

public class AttendanceUpdateDTO {
    private Attendance.AttendanceStatus status;

    public Attendance.AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(Attendance.AttendanceStatus status) {
        this.status = status;
    }
}
