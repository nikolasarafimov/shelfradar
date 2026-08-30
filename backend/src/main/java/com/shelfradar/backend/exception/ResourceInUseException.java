package com.shelfradar.backend.exception;

public class ResourceInUseException
        extends RuntimeException {

    public ResourceInUseException(
            String message
    ) {
        super(message);
    }
}