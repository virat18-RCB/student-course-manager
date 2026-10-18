package com.lab.studentmanager;

import com.lab.studentmanager.model.Course;
import com.lab.studentmanager.model.Student;
import com.lab.studentmanager.repository.CourseRepository;
import com.lab.studentmanager.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class StudentManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentManagerApplication.class, args);
    }

    // Adds sample data the first time the app runs (only if the tables are empty).
    @Bean
    CommandLineRunner seedData(CourseRepository courses, StudentRepository students) {
        return args -> {
            if (courses.count() > 0) return;
            Course react = courses.save(new Course("Web Development with React", 12));
            Course java = courses.save(new Course("Java and Spring Boot", 16));
            courses.save(new Course("Database Fundamentals", 8));
            students.save(new Student("Asha Rao", "asha@example.com", react));
            students.save(new Student("Ravi Kumar", "ravi@example.com", java));
        };
    }
}
