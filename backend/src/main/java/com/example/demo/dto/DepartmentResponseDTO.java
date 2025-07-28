package com.example.demo.dto;

public class DepartmentResponseDTO {
    private String id;
    private String name;
    private long salary;
    private int OverTimeRate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public long getSalary() { return salary; }
    public void setSalary(long salary) { this.salary = salary; }

    public int getOverTimeRate() {
        return OverTimeRate;
    }

    public void setOverTimeRate(int overTimeRate) {
        OverTimeRate = overTimeRate;
    }
}
