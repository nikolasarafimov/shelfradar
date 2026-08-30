package com.shelfradar.backend.exception;

public class InvalidLocationException
        extends RuntimeException {

    public InvalidLocationException(
            String message
    ) {
        super(message);
    }
}