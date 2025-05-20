package com.examscheduler.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// handles global exceptions and provides custom error responses for the application
@ControllerAdvice
public class GlobalExceptionHandler {

    // handles validation errors and returns a structured response with error messages
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        // extracts default error messages from field validation errors
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        // prepares the response body with the list of error messages
        Map<String, List<String>> responseBody = new HashMap<>();
        responseBody.put("errors", errors);

        // returns a bad_request response with the error details
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String,String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("error" , ex.getReason());
        return new ResponseEntity<>(responseBody, ex.getStatusCode());

    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Something went wrong on our end. Please try again later.");
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}