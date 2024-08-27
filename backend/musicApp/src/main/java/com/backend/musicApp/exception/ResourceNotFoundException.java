package com.backend.musicApp.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String object,String resourceName,String resource) {
        super(String.format("The %s object not found with this %s: %s",object,resourceName,resource));
    }
}
