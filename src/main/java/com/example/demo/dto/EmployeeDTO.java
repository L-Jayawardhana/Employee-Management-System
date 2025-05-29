package com.example.demo.dto;

public class EmployeeDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String nic;
    private String gender;
    private String phone;
    private String email;
    private int age;
    private String departmentId;
    private String departmentName;

    public EmployeeDTO() {}

    public EmployeeDTO(String id, String firstName, String lastName, String nic, String gender, String phone, String email, int age, String departmentId, String departmentName) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nic = nic;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
        this.age = age;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getNic() { return nic; }
    public void setNic(String nic) { this.nic = nic; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}
