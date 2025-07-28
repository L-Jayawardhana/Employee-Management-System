package com.example.demo.mapper;

import com.example.demo.dto.SalaryCreateDTO;
import com.example.demo.dto.SalaryResponseDTO;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.model.Salary;
import org.springframework.stereotype.Component;

@Component
public class SalaryMapper {
    public Salary toEntity(SalaryCreateDTO dto, Employee employee, Department department) {
        Salary salary = new Salary();
        salary.setEmployee(employee);
        salary.setStartDate(dto.getStartDate());
        salary.setEndDate(dto.getEndDate());
        salary.setDepartment(department);
        salary.setBonus(dto.getBonus());
        return salary;
    }

    public SalaryResponseDTO toResponseDTO(Salary savedSalary, Employee employee, Department department) {
        SalaryResponseDTO responseDTO = new SalaryResponseDTO();
        responseDTO.setId(savedSalary.getId());
        responseDTO.setEmployee_id(employee.getId());
        responseDTO.setStartDate(savedSalary.getStartDate());
        responseDTO.setEndDate(savedSalary.getEndDate());
        responseDTO.setDepartment_id(department.getId());
        responseDTO.setBaseSalary(department.getSalary());
        responseDTO.setDaysPRESENT(savedSalary.getDaysPresent());
        responseDTO.setDaysLEAVE(savedSalary.getDaysLeave());
        responseDTO.setDaysHALF_DAY(savedSalary.getDaysHalfDay());
        responseDTO.setDaysNO_PAY(savedSalary.getDaysNoPay());
        responseDTO.setOverTimeHours(savedSalary.getOverTimeHours());
        responseDTO.setDeduction(savedSalary.getDeduction());
        responseDTO.setBonus(savedSalary.getBonus());
        responseDTO.setOverTimeRate(department.getOverTimeRate());
        responseDTO.setOverTimePay(savedSalary.getOverTimePay());
        responseDTO.setTotalSalary(savedSalary.getTotalSalary());
        return responseDTO;
    }
}
