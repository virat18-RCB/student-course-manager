package com.lab.studentmanager.service;

import com.lab.studentmanager.model.Course;
import com.lab.studentmanager.repository.CourseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) { this.repo = repo; }

    public List<Course> findAll() { return repo.findAll(); }

    public Course findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found."));
    }

    public Course create(Course course) {
        course.setId(null);
        return repo.save(course);
    }

    public Course update(Long id, Course course) {
        findById(id); // 404 if it does not exist
        course.setId(id);
        return repo.save(course);
    }

    public void delete(Long id) {
        findById(id);
        repo.deleteById(id);
    }
}
