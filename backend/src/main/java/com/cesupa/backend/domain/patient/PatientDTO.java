package com.cesupa.backend.domain.patient;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.br.CPF;

import com.cesupa.backend.domain.Gender;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
@Setter
public class PatientDTO {

    private Long id;

    @NotBlank(message = "Campo obrigatório")
    private String fullName;

    @NotNull(message = "Campo obrigatório")
    @Past(message = "Data de nascimento deve ser válida")
    private LocalDate birthDate;

    @NotBlank(message = "Campo obrigatório")
    @CPF(message = "CPF deve ser válido")
    private String cpf;

    @NotNull
    private Gender gender;

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

    private PatientBloodType bloodType;
    private String knownAllergies;
    private Boolean active;

    public PatientDTO(Patient entity) {
        id = entity.getId();
        fullName = entity.getFullName();
        birthDate = entity.getBirthDate();
        cpf = entity.getCpf();
        gender = entity.getGender();
        phone = entity.getPhone();
        address = entity.getAddress();
        email = entity.getEmail();
        bloodType = entity.getBloodType();
        knownAllergies = entity.getKnownAllergies();
        active = entity.getActive();
    }
}
