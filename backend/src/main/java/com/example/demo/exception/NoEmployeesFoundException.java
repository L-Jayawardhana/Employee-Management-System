package com.example.demo.exception;

// This class defines a custom exception that is thrown when no employees are found in the department.
// department is there, and it is not null, but no employees are found in that department.
public class NoEmployeesFoundException extends RuntimeException {
    public NoEmployeesFoundException(String message) {
        super(message);
    }
}
