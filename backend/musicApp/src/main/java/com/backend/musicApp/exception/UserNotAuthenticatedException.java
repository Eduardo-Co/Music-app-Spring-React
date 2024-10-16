package com.backend.musicApp.exception;

public class UserNotAuthenticatedException extends RuntimeException {
    public UserNotAuthenticatedException() {
        super("Bearer Token incorrect");
    }

    public UserNotAuthenticatedException(String message) {
        super(message);
    }
}
