package com.example.demo.dto;

import java.time.LocalDate;

public class SalaryResponseDTO {
    private long id;
    private String employee_id;
    private LocalDate startDate;
    private LocalDate endDate;
    private String department_id;
    private long baseSalary;
    private int daysPRESENT;
    private int daysLEAVE;
    private int daysNO_PAY;
    private int daysHALF_DAY;
    private long deduction;
    private long bonus;
    private double OverTimeHours;
    private long OverTimeRate;
    private long OverTimePay;
    private long totalSalary;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmployee_id() {
        return employee_id;
    }

    public void setEmployee_id(String employee_id) {
        this.employee_id = employee_id;
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

    public String getDepartment_id() {
        return department_id;
    }

    public void setDepartment_id(String department_id) {
        this.department_id = department_id;
    }

    public long getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(long basicSalary) {
        this.baseSalary = basicSalary;
    }

    public int getDaysPRESENT() {
        return daysPRESENT;
    }

    public void setDaysPRESENT(int daysPRESENT) {
        this.daysPRESENT = daysPRESENT;
    }

    public int getDaysLEAVE() {
        return daysLEAVE;
    }

    public void setDaysLEAVE(int daysLEAVE) {
        this.daysLEAVE = daysLEAVE;
    }

    public int getDaysNO_PAY() {
        return daysNO_PAY;
    }

    public void setDaysNO_PAY(int daysNO_PAY) {
        this.daysNO_PAY = daysNO_PAY;
    }

    public int getDaysHALF_DAY() {
        return daysHALF_DAY;
    }

    public void setDaysHALF_DAY(int daysHALF_DAY) {
        this.daysHALF_DAY = daysHALF_DAY;
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

    public double getOverTimeHours() {
        return OverTimeHours;
    }

    public void setOverTimeHours(double overTimeHours) {
        OverTimeHours = overTimeHours;
    }

    public long getOverTimeRate() {
        return OverTimeRate;
    }

    public void setOverTimeRate(long overTimeRate) {
        OverTimeRate = overTimeRate;
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
