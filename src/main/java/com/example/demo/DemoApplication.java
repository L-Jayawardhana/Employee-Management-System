package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.demo.model.Department;
import com.example.demo.repository.DepartmentRepository;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initDepartments(DepartmentRepository departmentRepository) {
		return args -> {
			departmentRepository.save(new Department("MAIN", "maintenance", 45000));
			departmentRepository.save(new Department("MARK", "marketing", 40000));
			departmentRepository.save(new Department("MANU", "manufacturing", 38000));
			departmentRepository.save(new Department("DESI", "designing", 38000));
		};
	}
}
