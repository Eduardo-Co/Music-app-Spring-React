package com.backend.musicApp.exception;

public class ResourceAlreadyExistisException extends RuntimeException{
    public ResourceAlreadyExistisException(String object, String resourceName, String resource){
        super(String.format("The %s object already exists with this %s: %s",object,resourceName,resource));
    }
}
