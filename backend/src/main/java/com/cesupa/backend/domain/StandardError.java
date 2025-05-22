package com.cesupa.backend.domain;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class StandardError {
    
    private Instant timestamp;
    private Integer status;
    private String error;
    private String message;
    private String path;
}
