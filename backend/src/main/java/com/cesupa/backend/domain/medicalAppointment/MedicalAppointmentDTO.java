package com.cesupa.backend.domain.medicalAppointment;

import java.time.LocalDateTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter 
public class MedicalAppointmentDTO {

    private Long id;

    @NotNull(message = "Campo obrigatório")
    private Long doctorId;

    @NotNull(message = "Campo obrigatório")
    private Long patientId;

    @NotNull(message = "Campo obrigatório")
    @FutureOrPresent(message = "Data deve ser válida")
    private LocalDateTime dateTime;

    private String reason;
    private AppointmentStatus status;

    public MedicalAppointmentDTO(MedicalAppointment entity) {
        id = entity.getId();
        doctorId = entity.getDoctor().getId();
        patientId = entity.getPatient().getId();
        dateTime = entity.getDateTime();
        reason = entity.getReason();
        status = entity.getStatus();
    }
}
