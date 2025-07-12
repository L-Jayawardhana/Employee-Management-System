package com.example.demo.exception;

import jakarta.servlet.http.HttpServletRequest;
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
    public ResponseEntity<ErrorResponse> handleEmployeeNotFound(EmployeeNotFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 404, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(NoEmployeesFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoEmployeesFound(NoEmployeesFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 204, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorResponse);
    }

    @ExceptionHandler(EmployeeAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmployeeAlreadyExists(EmployeeAlreadyExistsException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 409, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(DepartmentAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentAlreadyExists(DepartmentAlreadyExistsException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 409, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    //throws when a department is not found in the system but system is not empty
    @ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleDepartmentNotFound(DepartmentNotFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 404, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    //throws when no departments are found in the system (system is empty)
    @ExceptionHandler(NoDepartmentsFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoDepartmentsFound(NoDepartmentsFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 204, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorResponse);
    }

    @ExceptionHandler(AttendanceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAttendanceNotFound(AttendanceNotFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 404, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(NoAttendancesFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoAttendancesFound(NoAttendancesFoundException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 204, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(errorResponse);
    }

    @ExceptionHandler(AttendanceAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleAttendanceAlreadyExists(AttendanceAlreadyExistsException e, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(e.getMessage(), 409, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        ErrorResponse errorResponse = new ErrorResponse("Internal Server Error: " + ex.getMessage(), 500, LocalDateTime.now(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }


}