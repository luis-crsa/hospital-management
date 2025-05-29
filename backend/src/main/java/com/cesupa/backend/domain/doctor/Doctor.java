package com.cesupa.backend.domain.doctor;

import java.time.LocalDate;
import java.time.LocalTime;

import com.cesupa.backend.domain.Gender;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class Doctor {

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
    private LocalTime workStart;
    private LocalTime workEnd;
    private Boolean active;
}
