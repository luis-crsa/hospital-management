package com.cesupa.backend;

import com.cesupa.backend.domain.Gender;
import com.cesupa.backend.domain.doctor.Doctor;
import com.cesupa.backend.domain.medicalAppointment.AppointmentStatus;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointment;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointmentDTO;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.domain.patient.PatientBloodType;
import com.cesupa.backend.domain.patient.PatientDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class Factory {

    public static Patient createPatient() {
        return new Patient(1L, "Luís Cláudio, Rodrigues Sarmento", LocalDate.parse("2006-04-13"), "614.735.930-42", Gender.MALE, "(91) 99999-2104", "Almirante Barroso 2104" ,"luis.sarmento@email.com", PatientBloodType.A_POSITIVE, "Camarão", true);
    }

    public static Doctor createDoctor() {
        return new Doctor(1L, "Pedro Henrique", LocalDate.parse("1985-05-15"), "077.432.800-20", Gender.MALE, "(91) 99999-2104", "Almirante Barroso 2104" ,"pedro.henrique@email.com", LocalTime.parse("08:00:00"), LocalTime.parse("16:00:00"), true);
    }

    public static PatientDTO createPatientDto() {
        return new PatientDTO(createPatient());
    }

    public static MedicalAppointment createAppointment() {
        return new MedicalAppointment(1L, createDoctor(), createPatient(), LocalDateTime.parse("2025-06-01 10:00:00"),"Dor nas costas", AppointmentStatus.SCHEDULED);
    }

    public static MedicalAppointmentDTO createAppointmentDto() {
        return new MedicalAppointmentDTO(createAppointment());
    }
}
