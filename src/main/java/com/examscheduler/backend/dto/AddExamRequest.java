package com.examscheduler.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

// dto class for capturing exam details when adding a new exam
public class AddExamRequest {

    @NotBlank(message = "Subject cannot be blank")
    private String subject;

    @NotNull(message = "Exam date is required")
    private LocalDate examDate;

    @NotNull(message = "Exam time is required")
    private LocalTime examTime;

    @NotBlank(message = "Location cannot be left blank")
    private String location;

    public AddExamRequest() {
    }

    public AddExamRequest(String subject, LocalDate examDate, LocalTime examTime, String location) {
        this.subject = subject;
        this.examDate = examDate;
        this.examTime = examTime;
        this.location = location;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDate getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDate examDate) {
        this.examDate = examDate;
    }

    public LocalTime getExamTime() {
        return examTime;
    }

    public void setExamTime(LocalTime examTime) {
        this.examTime = examTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}



