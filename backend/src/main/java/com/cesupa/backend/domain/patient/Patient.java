package com.cesupa.backend.domain.patient;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.cesupa.backend.domain.Gender;

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

    @Column(unique = true)
    private String cpf;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String phone;
    private String address;
    private String email;

    @Enumerated(EnumType.STRING)
    private PatientBloodType bloodType;

    private String knownAllergies;
    private Boolean active;
}
