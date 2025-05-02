package com.examscheduler.backend.repository;

import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findAllByUser(User user);
}
