package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "department",
        uniqueConstraints = {
                @UniqueConstraint(name = "unique_department_name", columnNames = "name")
        }
)
public class Department {

    @Id
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "salary", nullable = false)
    private long salary;

    @Column(name = "OverTimeRate", nullable = false)
    private int OverTimeRate;

    @PrePersist
    public void generateId() {
        if (this.name != null) {
            this.id = name.toUpperCase().substring(0, Math.min(name.length(), 4));
        }
    }

    public Department() {}

    public Department(String id, String name, long salary, int overTimeRate) {
        this.id = id;
        this.name = name;
        this.salary = salary;
        this.OverTimeRate = overTimeRate;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getSalary() {
        return salary;
    }

    public void setSalary(long salary) {
        this.salary = salary;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getOverTimeRate() {
        return OverTimeRate;
    }

    public void setOverTimeRate(int overTimeRate) {
        OverTimeRate = overTimeRate;
    }
}
