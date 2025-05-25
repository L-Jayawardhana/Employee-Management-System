package com.example.demo.Enum;

public enum AttendanceStatus {
    PRESENT("Present"),
    HALF_DAY("Half_day"),
    LEAVE("Leave(absent)"),
    NO_PAY("No-pay");

    private final String status;

    AttendanceStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}