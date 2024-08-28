package com.backend.musicApp.exception;

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String object, String resourceName, String resource){
        super(String.format("There is already a %s with this %s",object,resourceName));
    }
}
