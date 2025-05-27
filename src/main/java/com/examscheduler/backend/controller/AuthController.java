package com.examscheduler.backend.controller;

import com.examscheduler.backend.dto.SignupRequest;
import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping(path = "api/auth")
public class AuthController {

    public final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signUpUser(@RequestBody SignupRequest signupRequest) {

        userService.registerUser(signupRequest);
        return ResponseEntity.ok("User registered successfully");

    }


}
