package com.example.demo.Config;

import com.example.demo.model.Employee;
import com.example.demo.model.Role;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        if (!employeeRepository.existsByEmail("admin@company.com")) {
            Employee admin = new Employee();
            admin.setId("ADMIN001"); // Set the ID manually
            admin.setFirst_name("Admin");
            admin.setLast_name("User");
            admin.setNic("000000000V");
            admin.setAddress("Company Address");
            admin.setGender("Other");
            admin.setPhone("0000000000");
            admin.setEmail("admin@company.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setBirthday(LocalDate.of(1990, 1, 1));
            admin.setAge(35);
            admin.setRole(Role.ADMIN);
            // Note: You might need to set a department too if it's required
            
            employeeRepository.save(admin);
        }
    }
}