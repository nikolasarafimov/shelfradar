package com.shelfradar.backend.exception;

public class InvalidInventoryStateException
        extends RuntimeException {

    public InvalidInventoryStateException(
            String message
    ) {
        super(message);
    }
}