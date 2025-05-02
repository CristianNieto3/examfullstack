package com.examscheduler.backend.controller;

import com.examscheduler.backend.dto.AddExamRequest;
import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "api/exams")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addExam(@RequestBody AddExamRequest addExamRequest) {
        examService.addExam(addExamRequest);   // allows user to fill out neccessary fields
        return ResponseEntity.ok("Exam added successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Exam>> getAllExams() {
        List<Exam> exams = examService.getAllExamsForCurrentUser(); // goes through the list of exams for the user and returns them
        return ResponseEntity.ok(exams);
    }
}
