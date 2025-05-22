package com.cesupa.backend.domain.patient;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PatientDTO {

    private Long id;

    @NotBlank(message = "Campo obrigatório")
    private String fullName;

    @NotNull(message = "Campo obrigatório")
    @Past(message = "Data de nascimento deve ser no passado")
    private LocalDate birthDate;

    @NotBlank(message = "Campo obrigatório")
    @CPF(message = "CPF deve ser válido")
    private String cpf;

    @NotNull
    @Enumerated(EnumType.STRING)
    private PatientGender gender;

    @NotBlank(message = "Campo obrigatório")
    @Pattern(
            regexp = "^\\(?\\d{2}\\)?\\s?\\d{4,5}-?\\d{4}$",
            message = "Telefone deve ser válido"
    )
    private String phone;

    @NotBlank(message = "Campo obrigatório")
    @Size(max = 200, message = "Endereço deve ter no máximo 200 caracteres")
    private String address;

    @Email(message = "Email deve ser válido")
    private String email;

    @Enumerated(EnumType.STRING)
    private PatientBloodType bloodType;

    private String knownAllergies;
    private Boolean active;
}
