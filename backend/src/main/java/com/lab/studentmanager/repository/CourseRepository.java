package com.lab.studentmanager.repository;

import com.lab.studentmanager.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}
