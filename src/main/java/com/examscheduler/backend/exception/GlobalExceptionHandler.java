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

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1) Handle your custom BadRequestException first
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException ex) {
        // Return plain text -> front end’s response.text() will be the message
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    // 2) Bean Validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.toList());

        Map<String, List<String>> body = new HashMap<>();
        body.put("errors", errors);

        return ResponseEntity.badRequest().body(body);
    }

    // 3) Explicit ResponseStatusExceptions
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, String> body = Map.of("error", ex.getReason());
        return new ResponseEntity<>(body, ex.getStatusCode());
    }

    // 4) Fallback for all other exceptions
    // src/main/java/com/examscheduler/backend/exception/GlobalExceptionHandler.java

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> debugAllExceptions(Exception ex) {
        StringBuilder sb = new StringBuilder();
        sb.append(ex.getClass().getName())
                .append(": ")
                .append(ex.getMessage())
                .append("\n");
        for (StackTraceElement ste : ex.getStackTrace()) {
            sb.append("    at ").append(ste).append("\n");
        }
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(sb.toString());
    }

}
