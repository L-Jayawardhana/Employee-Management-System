package com.example.demo.dto;

public class DepartmentCreateDTO {
    private String name;
    private long salary;
    private int OverTimeRate;

    public int getOverTimeRate() {
        return OverTimeRate;
    }

    public void setOverTimeRate(int overTimeRate) {
        OverTimeRate = overTimeRate;
    }



    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public long getSalary() { return salary; }
    public void setSalary(long salary) { this.salary = salary; }
}
