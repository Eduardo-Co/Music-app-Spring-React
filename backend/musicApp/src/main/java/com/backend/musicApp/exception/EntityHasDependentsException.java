package com.backend.musicApp.exception;

public class EntityHasDependentsException extends RuntimeException{
    public EntityHasDependentsException(String object, String dependent){
        super("The" + object +  "cannot be deleted because it is used in an" + dependent);
    }
}
