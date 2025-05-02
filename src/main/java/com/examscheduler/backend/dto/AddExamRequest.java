package com.examscheduler.backend.dto;

import java.time.LocalDateTime;

public class AddExamRequest {

    private String subject;
    private LocalDateTime examDate;
    private String location;

    public AddExamRequest() {
    }

    public AddExamRequest(String subject, LocalDateTime examDate, String location) {
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
