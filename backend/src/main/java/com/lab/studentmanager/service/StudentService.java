package com.lab.studentmanager.service;

import com.lab.studentmanager.model.Course;
import com.lab.studentmanager.model.Student;
import com.lab.studentmanager.repository.CourseRepository;
import com.lab.studentmanager.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository students;
    private final CourseRepository courses;

    public StudentService(StudentRepository students, CourseRepository courses) {
        this.students = students;
        this.courses = courses;
    }

    public List<Student> findAll() { return students.findAll(); }

    public Student findById(Long id) {
        return students.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found."));
    }

    public Student create(Student student) {
        student.setId(null);
        attachCourse(student);
        return students.save(student);
    }

    public Student update(Long id, Student student) {
        findById(id);
        student.setId(id);
        attachCourse(student);
        return students.save(student);
    }

    public void delete(Long id) {
        findById(id);
        students.deleteById(id);
    }

    // Business rule: a student must be linked to a course that really exists.
    private void attachCourse(Student student) {
        Long courseId = student.getCourseId();
        Course course = courses.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Selected course does not exist."));
        student.setCourse(course);
    }
}
