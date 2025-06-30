package com.example.demo.dto;

public class DepartmentUpdateDTO {
    private long salary;

    public DepartmentUpdateDTO(long salary) {
        this.salary = salary;
    }

    public long getSalary() {
        return salary;
    }

    public void setSalary(long salary) {
        this.salary = salary;
    }
}
