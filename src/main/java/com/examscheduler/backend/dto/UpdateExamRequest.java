package com.examscheduler.backend.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

// dto class for capturing updated exam details
public class UpdateExamRequest {

    @NotBlank(message = "Subject cannot be blank")
    private String subject;

    @NotNull(message = "Exam date is required")
    @JsonFormat(shape = JsonFormat.Shape.STRING,
            pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX",
            timezone = "UTC")
    private LocalDateTime examDate;

    @NotBlank(message = "Location cannot be left blank")
    private String location;

    public UpdateExamRequest() {
    }

    // initializes the update exam request with subject, date, and location
    public UpdateExamRequest(String subject, LocalDateTime examDate, String location) {
        this.subject = subject;
        this.examDate = examDate;
        this.location = location;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public LocalDateTime getExamDate() {
        return examDate;
    }

    public void setExamDate(LocalDateTime examDate) {
        this.examDate = examDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}