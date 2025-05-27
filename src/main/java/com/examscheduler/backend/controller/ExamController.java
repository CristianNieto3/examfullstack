package com.examscheduler.backend.controller;

import com.examscheduler.backend.dto.AddExamRequest;
import com.examscheduler.backend.dto.UpdateExamRequest;
import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.repository.ExamRepository;
import com.examscheduler.backend.service.ExamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/exams")
public class ExamController {

    private final ExamService examService;
    private final ExamRepository examRepository;

    public ExamController(ExamService examService, ExamRepository examRepository) {
        this.examService = examService;
        this.examRepository = examRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addExam(@Valid @RequestBody AddExamRequest addExamRequest) {
        examService.addExam(addExamRequest);   // allows the user to fill out necessary fields
        return ResponseEntity.ok("Exam added successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Exam>> getAllExams() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();      // username validation
        List<Exam> exams = examService.getAllExamsForCurrentUser();// goes through the list of exams for the user and returns them
        return ResponseEntity.ok(exams);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id); // perform the deletion
        return ResponseEntity.noContent().build(); // return 204 No Content
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        Exam exam = examService.getExamById(id);
        return ResponseEntity.ok(exam);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateExam(
            @PathVariable Long id,
            @RequestBody UpdateExamRequest updateRequest
    ) {
        examService.updateExam(id, updateRequest);
        return ResponseEntity.ok("Exam updated successfully");
    }



    }

