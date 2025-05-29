package com.cesupa.backend.service.exceptions;

public class ConflictException extends RuntimeException{

    public ConflictException(String msg) {
        super(msg);
    }
}
