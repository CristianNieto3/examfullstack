package com.examscheduler.backend.service;

import com.examscheduler.backend.dto.AddExamRequest;
import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.ExamRepository;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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

    public void addExam(AddExamRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> optionalUser = userRepository.findByUsername(currentUsername);

        if(optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + currentUsername);
        }
        User user = optionalUser.get();
        // create the exam obj and add the info to it
        Exam exam = new Exam();
        exam.setSubject(request.getSubject());
        exam.setExamDate(request.getExamDate());
        exam.setLocation(request.getLocation());
        exam.setUser(user);
        // save the exam
        examRepository.save(exam);

    }

    public List<Exam> getAllExamsForCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName(); // get username
        User user = userRepository.findByUsername(currentUsername) // creates the user obj and assigns the username
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername)); //error
        return examRepository.findAllByUser(user); //return all exams for the user
    }


}
