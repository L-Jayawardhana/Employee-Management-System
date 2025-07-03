package com.example.demo.exception;

public class NoDepartmentsFoundException extends RuntimeException {
    public NoDepartmentsFoundException(String message) {
        super(message);
    }
}
