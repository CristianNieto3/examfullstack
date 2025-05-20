package com.examscheduler.backend.service;

import com.examscheduler.backend.dto.SignupRequest;
import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // constructor to inject user repository and password encoder dependencies
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // registers a new user by saving their details to the database
    public void registerUser(SignupRequest signupRequest) {
        // create a new user object
        User user = new User();

        // set the username from the signup request
        user.setUsername(signupRequest.getUsername());

        // encode the raw password before saving to the database
        String rawPassword = signupRequest.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);

        // save the user to the database
        userRepository.save(user);
    }
}











