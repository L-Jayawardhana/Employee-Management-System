package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.SalaryCreateDTO;
import com.example.demo.dto.SalaryResponseDTO;
import com.example.demo.exception.DepartmentNotFoundException;
import com.example.demo.exception.EmployeeNotFoundException;
import com.example.demo.exception.SalaryNotFoundException;
import com.example.demo.mapper.SalaryMapper;
import com.example.demo.model.Attendance;
import com.example.demo.model.Department;
import com.example.demo.model.Employee;
import com.example.demo.model.Salary;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.SalaryRepository;

@Service
public class SalaryService {
    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final SalaryMapper salaryMapper;
    private final SalaryRepository salaryRepository;

    @Autowired
    public SalaryService(AttendanceRepository attendanceRepository, EmployeeRepository employeeRepository, DepartmentRepository departmentRepository, SalaryMapper salaryMapper, SalaryRepository salaryRepository) {
        this.attendanceRepository = attendanceRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.salaryMapper = salaryMapper;
        this.salaryRepository = salaryRepository;
    }

    public SalaryResponseDTO createSalary(SalaryCreateDTO dto) {
        Employee employee = employeeRepository.findById(dto.getEmployee_id())
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + dto.getEmployee_id()));
        Department department = departmentRepository.findById(dto.getDepartment_id())
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + dto.getDepartment_id()));
        Salary salary = salaryMapper.toEntity(dto, employee, department);
        String employeeId = dto.getEmployee_id(); // Use the actual ID

        int daysPRESENT = attendanceRepository.findByEmployee_IdAndDateBetweenAndStatus(employeeId, dto.getStartDate(), dto.getEndDate(), Attendance.AttendanceStatus.valueOf("PRESENT")).size();
        int daysLEAVE = attendanceRepository.findByEmployee_IdAndDateBetweenAndStatus(employeeId, dto.getStartDate(), dto.getEndDate(), Attendance.AttendanceStatus.valueOf("LEAVE")).size();
        int daysNO_PAY = attendanceRepository.findByEmployee_IdAndDateBetweenAndStatus(employeeId, dto.getStartDate(), dto.getEndDate(), Attendance.AttendanceStatus.valueOf("NO_PAY")).size();
        int daysHALF_DAY = attendanceRepository.findByEmployee_IdAndDateBetweenAndStatus(employeeId, dto.getStartDate(), dto.getEndDate(), Attendance.AttendanceStatus.valueOf("HALF_DAY")).size();
        double overTimeHours = attendanceRepository.findByEmployee_IdAndDateBetween(employeeId, dto.getStartDate(), dto.getEndDate())
                .stream()
                .mapToDouble(Attendance::getOverTimeHours)
                .sum();
        long overTimePay = (long) (overTimeHours * department.getOverTimeRate());
        long deduction = (daysNO_PAY * 2500L) + (daysHALF_DAY * 1200L);
        long totalSalary = (long) (department.getSalary() - deduction + overTimePay + dto.getBonus());
        salary.setDeduction(deduction);
        salary.setBonus(dto.getBonus());
        salary.setOverTimePay(overTimePay);
        salary.setTotalSalary(totalSalary);
        salary.setDaysPresent(daysPRESENT);
        salary.setDaysLeave(daysLEAVE);
        salary.setDaysNoPay(daysNO_PAY);
        salary.setDaysHalfDay(daysHALF_DAY);
        salary.setOverTimeHours(overTimeHours);
        salary.setBaseSalary(department.getSalary());
        Salary savedSalary = salaryRepository.save(salary);
        return salaryMapper.toResponseDTO(savedSalary, employee, department);
    }

    public SalaryResponseDTO getSalaryById(long id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new SalaryNotFoundException("Salary not found with id: " + id));
        Employee employee = employeeRepository.findById(salary.getEmployee().getId())
                .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + salary.getEmployee().getId()));
        Department department = departmentRepository.findById(salary.getDepartment().getId())
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + salary.getDepartment().getId()));

        return salaryMapper.toResponseDTO(salary, employee, department);
    }

    public List<SalaryResponseDTO> getSalaryByEmployeeId(String id) {
        Employee employee = employeeRepository.findById(id)
                        .orElseThrow(() -> new EmployeeNotFoundException("Employee not found with id: " + id));
        List<Salary> salaries = salaryRepository.findByEmployee_Id(id);
        if (salaries.isEmpty()) {
                throw new SalaryNotFoundException("No salaries found for employee with id: " + id);
        }
        return salaries.stream()
                        .map(salary -> {
                                Department department = departmentRepository.findById(salary.getDepartment().getId())
                                        .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id: " + salary.getDepartment().getId()));
                                return salaryMapper.toResponseDTO(salary, employee, department);
                        })
                        .collect(Collectors.toList());
    }
}
