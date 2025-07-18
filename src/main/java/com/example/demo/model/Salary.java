package com.example.demo.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "salary")
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "department_id" , nullable = false)
    private Department department;

    @Column(name = "base_salary", nullable = false)
    private long baseSalary;

    @Column(name = "days_present", nullable = false)
    private int daysPresent;

    @Column(name = "days_leave", nullable = false)
    private int daysLeave;

    @Column(name = "days_half_day", nullable = false)
    private int daysHalfDay;

    @Column(name = "days_no_pay", nullable = false)
    private int daysNoPay;

    @Column(name = "total_deduction", nullable = false)
    private long deduction;

    @Column(name = "bonus", nullable = false)
    private long bonus;

    @Column(name = "over_time_hours", nullable = false)
    private double overTimeHours;

    @Column(name = "over_time_pay", nullable = false)
    private long OverTimePay;

    @Column(name = "total_salary", nullable = false)
    private long totalSalary;

    @PrePersist
    @PreUpdate
    private void calculateTotalSalary() {
        if (employee != null && department != null) {
            long baseSalary = department.getSalary();
            this.totalSalary = baseSalary + bonus - deduction + OverTimePay;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public long getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(long baseSalary) {
        this.baseSalary = baseSalary;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public int getDaysPresent() {
        return daysPresent;
    }

    public void setDaysPresent(int daysPresent) {
        this.daysPresent = daysPresent;
    }

    public int getDaysLeave() {
        return daysLeave;
    }

    public void setDaysLeave(int daysLeave) {
        this.daysLeave = daysLeave;
    }

    public int getDaysHalfDay() {
        return daysHalfDay;
    }

    public void setDaysHalfDay(int daysHalfDay) {
        this.daysHalfDay = daysHalfDay;
    }

    public int getDaysNoPay() {
        return daysNoPay;
    }

    public void setDaysNoPay(int daysNoPay) {
        this.daysNoPay = daysNoPay;
    }

    public double getOverTimeHours() {
        return overTimeHours;
    }

    public void setOverTimeHours(double overTimeHours) {
        this.overTimeHours = overTimeHours;
    }

    public long getDeduction() {
        return deduction;
    }

    public void setDeduction(long deduction) {
        this.deduction = deduction;
    }

    public long getBonus() {
        return bonus;
    }

    public void setBonus(long bonus) {
        this.bonus = bonus;
    }

    public long getOverTimePay() {
        return OverTimePay;
    }

    public void setOverTimePay(long overTimePay) {
        OverTimePay = overTimePay;
    }

    public long getTotalSalary() {
        return totalSalary;
    }

    public void setTotalSalary(long totalSalary) {
        this.totalSalary = totalSalary;
    }
}
