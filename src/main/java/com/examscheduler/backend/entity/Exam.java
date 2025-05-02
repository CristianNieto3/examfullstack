package com.examscheduler.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;



    private String subject;
    private LocalDateTime examDate;
    private String location;


    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;




    public Exam() {

    }

    public Exam(String subject, LocalDateTime examDate, String location, User user) {
        this.user = user;
        this.subject = subject;
        this.examDate = examDate;
        this.location = location;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
