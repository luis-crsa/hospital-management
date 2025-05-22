package com.cesupa.backend.service.exceptions;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import com.cesupa.backend.domain.StandardError;

import lombok.Getter;

@Getter
public class ValidationError extends StandardError{

    public ValidationError(Instant timestamp, Integer status, String error, String message, String path) {
        super(timestamp, status, error, message, path);
    }

    private List<FieldMessage> errors = new ArrayList<>();

    public void addError(String fieldName, String message){
        errors.add(new FieldMessage(fieldName, message));
    }
}
