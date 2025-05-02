package com.examscheduler.backend.security;

import com.examscheduler.backend.entity.User;
import com.examscheduler.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service // Marks this as a Spring-managed service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // Constructor injection for UserRepository
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // This method is called automatically by Spring Security when someone tries to log in
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Look up the user by username
        Optional<User> optionalUser = userRepository.findByUsername(username);

        // If not found, throw error (this triggers a 401)
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }

        User user = optionalUser.get();

        // Return a Spring Security-compatible user object
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword()) // Password must already be hashed (BCrypt)
                .roles("USER") // You can set custom roles later (like ADMIN, etc.)
                .build();
    }
}
