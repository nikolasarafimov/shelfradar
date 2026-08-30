package com.shelfradar.backend.exception;

import com.shelfradar.backend.dto.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.shelfradar.backend.exception.InvalidLocationException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            ResourceNotFoundException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage(),
                request,
                Map.of()
        );
    }

    @ExceptionHandler({
            DuplicateResourceException.class,
            ResourceInUseException.class
    })
    public ResponseEntity<ApiErrorResponse>
    handleConflict(
            RuntimeException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.CONFLICT,
                exception.getMessage(),
                request,
                Map.of()
        );
    }

    @ExceptionHandler(
            DataIntegrityViolationException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleDataIntegrityViolation(
            DataIntegrityViolationException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.CONFLICT,
                "The operation conflicts with existing data.",
                request,
                Map.of()
        );
    }

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {

        Map<String, String> fieldErrors =
                new LinkedHashMap<>();

        exception
                .getBindingResult()
                .getFieldErrors()
                .forEach(
                        error ->
                                fieldErrors.putIfAbsent(
                                        error.getField(),
                                        Objects.requireNonNullElse(
                                                error.getDefaultMessage(),
                                                "Invalid value."
                                        )
                                )
                );

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed.",
                request,
                fieldErrors
        );
    }

    @ExceptionHandler(
            ConstraintViolationException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleConstraintViolation(
            ConstraintViolationException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "Invalid request parameter.",
                request,
                Map.of()
        );
    }

    private ResponseEntity<ApiErrorResponse>
    buildResponse(
            HttpStatus status,
            String message,
            HttpServletRequest request,
            Map<String, String> fieldErrors
    ) {

        ApiErrorResponse response =
                new ApiErrorResponse(
                        Instant.now(),
                        status.value(),
                        status.getReasonPhrase(),
                        message,
                        request.getRequestURI(),
                        fieldErrors
                );

        return ResponseEntity
                .status(status)
                .body(response);
    }

    @ExceptionHandler(
            InvalidInventoryStateException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleInvalidInventoryState(
            InvalidInventoryStateException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request,
                Map.of()
        );
    }

    @ExceptionHandler(InvalidLocationException.class)
    public ResponseEntity<ApiErrorResponse>
    handleInvalidLocation(
            InvalidLocationException exception,
            HttpServletRequest request
    ) {

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage(),
                request,
                Map.of()
        );
    }
}