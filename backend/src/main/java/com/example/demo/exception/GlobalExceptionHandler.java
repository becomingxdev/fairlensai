// package com.example.demo.exception;

// public class GlobalExceptionHandler {
    
// }

package com.example.demo.exception;

import com.example.demo.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // 1. Handle File Upload Size Errors (Very common for CSVs)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONTENT_TOO_LARGE.value(),
                "The file you uploaded is too large! Please keep it under the limit set in application.properties.");
        return new ResponseEntity<>(error, HttpStatus.CONTENT_TOO_LARGE);
    }

    // 2. Handle File Reading/Writing Errors
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException exc) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "There was an error reading the CSV file: " + exc.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 3. Catch-All for any other unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception exc) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "An unexpected error occurred: " + exc.getMessage());
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}