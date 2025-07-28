package com.example.demo.exception;

public class NoAttendancesFoundException extends RuntimeException {
    public NoAttendancesFoundException(String message) {
        super(message);
    }
}
