package com.lab.studentmanager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required.")
    private String name;

    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address.")
    private String email;

    // Many students belong to one course (foreign key column: course_id)
    @NotNull(message = "Course is required.")
    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    public Student() {}

    public Student(String name, String email, Course course) {
        this.name = name;
        this.email = email;
        this.course = course;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    @JsonIgnore
    public Course getCourse() { return course; }
    @JsonIgnore
    public void setCourse(Course course) { this.course = course; }

    // The React app sends and receives a simple "courseId" number.
    public Long getCourseId() { return course == null ? null : course.getId(); }

    public void setCourseId(Long courseId) {
        if (courseId == null) {
            this.course = null;
        } else {
            Course c = new Course();
            c.setId(courseId);
            this.course = c; // replaced with the real Course in StudentService
        }
    }
}
