package com.examscheduler.backend.service;

import com.examscheduler.backend.dto.SignupRequest;
import com.examscheduler.backend.entity.Exam;
import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void registerUser(SignupRequest signupRequest) {
        User user = new User(); // create user obj
        user.setUsername(signupRequest.getUsername()); //gets the username so you can then set it
        user.setPassword(signupRequest.getPassword()); //get the password so you can then set it

        String rawPassword = signupRequest.getPassword(); //encoding the password
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user); // saves the user to database

    }







}
