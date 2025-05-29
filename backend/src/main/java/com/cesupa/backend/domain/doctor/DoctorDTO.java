package com.cesupa.backend.domain.doctor;

import java.time.LocalDate;
import java.time.LocalTime;

import com.cesupa.backend.domain.Gender;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class DoctorDTO {

    private Long id;
    private String fullName;
    private LocalDate birthDate;
    private String cpf;
    private Gender gender;
    private String phone;
    private String address;
    private String email;
    private LocalTime workStart;
    private LocalTime workEnd;
    private Boolean active;
}
