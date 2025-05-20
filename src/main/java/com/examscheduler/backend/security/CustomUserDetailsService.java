package com.examscheduler.backend.security;

import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

// service class for loading user details from the database for authentication
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // constructor to inject the user repository dependency
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // loads user details by username for authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // fetch the user from the database or throw an exception if not found
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // build and return a UserDetails object with the user's credentials and role
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }
}

