package com.lab.studentmanager.repository;

import com.lab.studentmanager.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}
