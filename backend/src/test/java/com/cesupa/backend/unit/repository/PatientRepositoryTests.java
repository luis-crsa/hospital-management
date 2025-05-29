package com.cesupa.backend.unit.repository;

import com.cesupa.backend.Factory;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.repository.PatientRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

@DataJpaTest
public class PatientRepositoryTests {

    @Autowired
    private PatientRepository repository;

    private long existingId;
    private long nonExistingId;
    private long countTotalPatients;

    @BeforeEach
    void setUp() throws  Exception {
        existingId = 1L;
        nonExistingId = 100L;
        countTotalPatients = 10L;
    }

    @Test
    public void saveShouldPersistWithAutoincrementWhenIdIsNull() {

        Patient patient = Factory.createPatient();
        patient.setId(null);

        patient = repository.save(patient);

        Assertions.assertNotNull(patient.getId());
        Assertions.assertEquals(countTotalPatients + 1, patient.getId());
    }

    @Test
    public void findByIdAndActiveTrueShouldReturnNonEmptyObjectWhenIdExists(){

        Optional<Patient> result = repository.findByIdAndActiveTrue(existingId);

        Assertions.assertTrue(result.isPresent());
    }

    @Test
    public void findByIdAndActiveTrueShouldReturnEmptyOptionalWhenIdDoesNotExist(){

        Optional<Patient> result = repository.findByIdAndActiveTrue(nonExistingId);

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void findByIdAndActiveTrueShouldReturnEmptyOptionalWhenPatientIsInactive() {
        Patient patient = Factory.createPatient();
        patient.setActive(false);
        patient = repository.save(patient);

        Optional<Patient> result = repository.findByIdAndActiveTrue(patient.getId());

        Assertions.assertTrue(result.isEmpty());
    }

    @Test
    public void saveShouldUpdateExistingPatient() {
        Optional<Patient> optional = repository.findById(existingId);
        Patient patient = optional.get();
        patient.setFullName("Novo nome");

        repository.save(patient);
        Optional<Patient> updated = repository.findById(existingId);

        Assertions.assertEquals("Novo nome", updated.get().getFullName());
    }
}
