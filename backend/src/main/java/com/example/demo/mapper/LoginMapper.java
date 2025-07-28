package com.example.demo.mapper;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.model.Employee;
import org.springframework.stereotype.Component;

@Component
public class LoginMapper {
    public LoginRequest toLoginRequest(String email, String password) {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);
        return loginRequest;
    }

    public LoginResponse toLoginResponse(Employee employee, String token) {
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setEmail(employee.getEmail());
        loginResponse.setRole(employee.getRole());
        loginResponse.setName(employee.getFirst_name());
        return loginResponse;
    }
}
