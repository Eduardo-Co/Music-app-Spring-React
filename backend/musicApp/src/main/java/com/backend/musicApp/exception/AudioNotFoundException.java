package com.backend.musicApp.exception;

public class AudioNotFoundException extends RuntimeException{
    public AudioNotFoundException(){
        super("Audio not found");
    }

}
