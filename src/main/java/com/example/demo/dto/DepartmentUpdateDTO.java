package com.example.demo.dto;

public class DepartmentUpdateDTO {
    private long salary;
    private int OverTimeRate;

    public DepartmentUpdateDTO(long salary) {
        this.salary = salary;
    }

    public long getSalary() {
        return salary;
    }

    public void setSalary(long salary) {
        this.salary = salary;
    }

    public int getOverTimeRate() {
        return OverTimeRate;
    }

    public void setOverTimeRate(int overTimeRate) {
        OverTimeRate = overTimeRate;
    }
}
