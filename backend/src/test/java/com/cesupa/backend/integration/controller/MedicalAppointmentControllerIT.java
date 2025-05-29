package com.cesupa.backend.integration.controller;

import com.cesupa.backend.Factory;
import com.cesupa.backend.domain.doctor.Doctor;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointment;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointmentDTO;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.repository.DoctorRepository;
import com.cesupa.backend.repository.MedicalAppointmentRepository;
import com.cesupa.backend.repository.PatientRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class MedicalAppointmentControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    private Doctor savedDoctor;
    private Patient savedPatient;
    private MedicalAppointment appointment;

    @BeforeEach
    void setUp() {
        savedDoctor = doctorRepository.save(Factory.createDoctor());
        savedPatient = patientRepository.save(Factory.createPatient());
        appointment = Factory.createAppointment();
    }

    @Test
    void shouldScheduleAppointmentSuccessfully() throws Exception {
        MedicalAppointmentDTO dto = new MedicalAppointmentDTO(appointment);

        mockMvc.perform(post("/api/medical-appointments/schedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void shouldNotScheduleAppointmentOutsideDoctorWorkingHours() throws Exception {
        MedicalAppointmentDTO dto = new MedicalAppointmentDTO();
        dto.setDoctorId(savedDoctor.getId());
        dto.setPatientId(savedPatient.getId());
        dto.setDateTime(LocalDateTime.of(2025, 6, 1, 7, 0));
        dto.setReason("Before working hours");

        mockMvc.perform(post("/api/medical-appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isConflict());
    }
}
