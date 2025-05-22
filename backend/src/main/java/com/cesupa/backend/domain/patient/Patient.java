package com.cesupa.backend.domain.patient;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "patient")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private LocalDate birthDate;
    private String cpf;
    private PatientGender gender;
    private String phone;
    private String address;
    private String email;
    private String bloodType;
    private String knownAllergies;
    private Boolean active;
}
