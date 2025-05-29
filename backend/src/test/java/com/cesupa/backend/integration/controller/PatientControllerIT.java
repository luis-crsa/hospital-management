package com.cesupa.backend.integration.controller;

import com.cesupa.backend.Factory;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.domain.patient.PatientDTO;
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

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class PatientControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PatientRepository repository;

    private Patient existingPatient;

    @BeforeEach
    void setup() {
        existingPatient = Factory.createPatient();
        existingPatient.setCpf("12345678900");
        repository.save(existingPatient);
    }

    @Test
    void insertShouldCreatePatientSuccessfully() throws Exception {
        PatientDTO newPatientDto = Factory.createPatientDto();
        String patientCpf = newPatientDto.getCpf();

        mockMvc.perform(post("/api/patients")
                        .content(objectMapper.writeValueAsString(newPatientDto))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.cpf").value(patientCpf));
    }

    @Test
    void insertShouldNotCreatePatientWithDuplicateCpf() throws Exception {
        Patient duplicatePatient = Factory.createPatient();
        duplicatePatient.setCpf(existingPatient.getCpf());

        mockMvc.perform(post("/api/patients")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicatePatient)))
                .andExpect(status().isConflict());
    }

    @Test
    void findByIdShouldFindPatientByIdSuccessfully() throws Exception {
        mockMvc.perform(get("/api/patients/{id}", existingPatient.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(existingPatient.getId()))
                .andExpect(jsonPath("$.cpf").value(existingPatient.getCpf()));
    }

    @Test
    void findByIdShouldReturnNotFoundWhenFindingNonExistentPatientById() throws Exception {
        mockMvc.perform(get("/api/patients/{id}", 99999L))
                .andExpect(status().isNotFound());
    }

    @Test
    void findAllPagedShouldListPagedPatients() throws Exception {
        mockMvc.perform(get("/api/patients")
                        .param("page", "0")
                        .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", not(empty())))
                .andExpect(jsonPath("$.content[0].id").exists());
    }

    @Test
    void UpdateShouldUpdatePatientSuccessfully() throws Exception {
        PatientDTO dto = new PatientDTO(existingPatient);
        dto.setFullName("Updated Name");

        mockMvc.perform(put("/api/patients/{id}", existingPatient.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Name"));
    }

    @Test
    void updateShouldReturnNotFoundWhenUpdatingNonExistentPatient() throws Exception {
        PatientDTO dto = new PatientDTO(existingPatient);
        dto.setFullName("Updated Name");

        mockMvc.perform(put("/api/patients/{id}", 99999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deactivateShouldDeactivatePatientSuccessfully() throws Exception {
        mockMvc.perform(delete("/api/patients/{id}", existingPatient.getId()))
                .andExpect(status().isNoContent());

        // Confirm patient is inactive in database
        Patient inactive = repository.findById(existingPatient.getId()).get();
        assert(!inactive.getActive());
    }

    @Test
    void deactivateShouldReturnNotFoundWhenDeactivatingNonExistentPatient() throws Exception {
        mockMvc.perform(delete("/api/patients/{id}", 20L))
                .andExpect(status().isNotFound());
    }
}

