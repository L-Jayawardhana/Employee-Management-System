package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // This class can be used to handle global exceptions in the application.
    // You can define methods annotated with @ExceptionHandler to handle specific exceptions.
    // For example, you can handle ResourceNotFoundException or any other custom exceptions here.

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEmployeeNotFound(EmployeeNotFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 404, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(NoEmployeesFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoEmployeesFound(NoEmployeesFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage() + " | happens 204 NO_CONTENT error", 204, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(EmployeeAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmployeeAlreadyExists(EmployeeAlreadyExistsException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 409, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    //throws when a department is not found in the system but system is not empty
    @ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentNotFound(DepartmentNotFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 404, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    //throws when no departments are found in the system (system is empty)
    @ExceptionHandler(NoDepartmentsFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoDepartmentsFound(NoDepartmentsFoundException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage() + " | happens 204 NO_CONTENT error", 204, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(DepartmentAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentAlreadyExists(DepartmentAlreadyExistsException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 409, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse( "Internal Server Error: " + ex.getMessage(),500, LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }


}