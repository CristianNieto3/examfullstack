package com.examscheduler.backend.service;

import com.examscheduler.backend.dto.AddExamRequest;
import com.examscheduler.backend.dto.UpdateExamRequest;
import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.ExamRepository;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExamService(ExamRepository examRepository, UserRepository userRepository) {
        this.examRepository = examRepository;
        this.userRepository = userRepository;
    }

    // adds a new exam for the currently authenticated user
    public void addExam(AddExamRequest request) {
        // get the current authenticated user's username
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(currentUsername);

        // throw an exception if the user is not found
        if(optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + currentUsername);
        }
        User user = optionalUser.get();

        // create a new exam and set its fields
        Exam exam = new Exam();
        exam.setSubject(request.getSubject());
        exam.setExamDate(request.getExamDate());
        exam.setLocation(request.getLocation());
        exam.setUser(user);

        // save the exam to the database
        examRepository.save(exam);
    }

    // retrieves all exams for the currently authenticated user
    public List<Exam> getAllExamsForCurrentUser() {
        // get the current authenticated user's username
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // find the user by username or throw an exception if not found
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername));

        // return all exams associated with the user
        return examRepository.findAllByUser(user);
    }

    // deletes an exam by its id
    public void deleteExam(Long id) {
        // get the current authenticated user's username
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (currentUsername == null) {
            throw new NullPointerException();
        }

        // find the user by username or throw an exception if not found
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername));

        // find the exam by id or throw an exception if not found
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        // check if the current user is authorized to delete the exam
        if(!exam.getUser().getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to delete this exam");
        }

        // delete the exam from the database
        examRepository.delete(exam);
    }

    // retrieves an exam by its id
    public Exam getExamById(Long id) {
        // get the current authenticated user's username
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // find the exam by id or throw an exception if not found
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        // check if the current user is authorized to view the exam
        if(!exam.getUser().getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to view this exam");
        }

        // return the exam
        return exam;
    }

    // updates an existing exam by its id
    public void updateExam(Long id, UpdateExamRequest updateRequest) {
        // get the current authenticated user's username
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

        // find the exam by id or throw an exception if not found
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Exam not found"));

        // check if the current user is authorized to update the exam
        if(!exam.getUser().getUsername().equals(currentUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to update this exam");
        }

        // update the exam's fields with the new values
        exam.setSubject(updateRequest.getSubject());
        exam.setExamDate(updateRequest.getExamDate());
        exam.setLocation(updateRequest.getLocation());

        // save the updated exam to the database
        examRepository.save(exam);
    }
}