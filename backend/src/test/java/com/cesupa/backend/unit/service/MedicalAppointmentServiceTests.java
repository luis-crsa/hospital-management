package com.cesupa.backend.unit.service;

import com.cesupa.backend.Factory;
import com.cesupa.backend.domain.doctor.Doctor;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointmentDTO;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.repository.DoctorRepository;
import com.cesupa.backend.repository.MedicalAppointmentRepository;
import com.cesupa.backend.repository.PatientRepository;
import com.cesupa.backend.service.MedicalAppointmentService;
import com.cesupa.backend.service.exceptions.ConflictException;
import com.cesupa.backend.service.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class MedicalAppointmentServiceTests {

    @InjectMocks
    private MedicalAppointmentService service;

    @Mock
    private MedicalAppointmentRepository medicalAppointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PatientRepository patientRepository;

    private Doctor doctor;
    private Patient patient;
    private MedicalAppointmentDTO dto;

    @BeforeEach
    void setUp() {
        doctor = Factory.createDoctor();

        patient = Factory.createPatient();

        dto = new MedicalAppointmentDTO();
        dto.setDoctorId(doctor.getId());
        dto.setPatientId(patient.getId());
        dto.setDateTime(LocalDateTime.of(2025, 6, 1, 9, 0));
        dto.setReason("Checkup");

        when(doctorRepository.findById(doctor.getId())).thenReturn(Optional.of(doctor));
        when(patientRepository.findById(patient.getId())).thenReturn(Optional.of(patient));
        when(medicalAppointmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    public void scheduleShouldReturnMedicalAppointmentDTOWhenSuccessful() {
        when(medicalAppointmentRepository.existsByDoctorIdAndDateTime(doctor.getId(), dto.getDateTime())).thenReturn(false);

        MedicalAppointmentDTO result = service.schedule(dto);

        Assertions.assertEquals(dto.getReason(), result.getReason());
        Assertions.assertEquals(dto.getDateTime(), result.getDateTime());
        Assertions.assertEquals(doctor.getId(), result.getDoctorId());
        Assertions.assertEquals(patient.getId(), result.getPatientId());
    }

    @Test
    public void scheduleShouldThrowResourceNotFoundExceptionWhenDoctorNotFound() {
        when(doctorRepository.findById(dto.getDoctorId())).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> {
            service.schedule(dto);
        });
    }

    @Test
    public void scheduleShouldThrowResourceNotFoundExceptionWhenPatientNotFound() {
        when(patientRepository.findById(dto.getPatientId())).thenReturn(Optional.empty());

        Assertions.assertThrows(ResourceNotFoundException.class, () -> {
            service.schedule(dto);
        });
    }

    @Test
    public void scheduleShouldThrowConflictExceptionWhenOutsideDoctorWorkHours() {
        dto.setDateTime(LocalDateTime.of(2025, 6, 1, 7, 0));

        Assertions.assertThrows(ConflictException.class, () -> {
            service.schedule(dto);
        });
    }

    @Test
    public void scheduleShouldThrowConflictExceptionWhenDateTimeAlreadyBooked() {
        when(medicalAppointmentRepository.existsByDoctorIdAndDateTime(doctor.getId(), dto.getDateTime())).thenReturn(true);

        Assertions.assertThrows(ConflictException.class, () -> {
            service.schedule(dto);
        });
    }
}
