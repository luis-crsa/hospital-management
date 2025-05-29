package com.cesupa.backend.unit.service;

import com.cesupa.backend.Factory;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.domain.patient.PatientDTO;
import com.cesupa.backend.repository.PatientRepository;
import com.cesupa.backend.service.PatientService;
import com.cesupa.backend.service.exceptions.ConflictException;
import com.cesupa.backend.service.exceptions.ResourceNotFoundException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class PatientServiceTests {

    @Mock
    private PatientRepository repository;

    @InjectMocks
    private PatientService service;

    private Patient patient;
    private PatientDTO patientDTO;
    private Long existingId;
    private Long nonExistingId;
    private PageImpl<Patient> page;

    @BeforeEach
    void setUp() {
        existingId = 1L;
        nonExistingId = 1000L;

        patient = Factory.createPatient();
        patientDTO = Factory.createPatientDto();
        page = new PageImpl<>(List.of(patient));

        when(repository.findByActiveTrue(any())).thenReturn(page);

        when(repository.findByIdAndActiveTrue(existingId)).thenReturn(Optional.of(patient));
        when(repository.findByIdAndActiveTrue(nonExistingId)).thenReturn(Optional.empty());

        when(repository.existsByCpf(patientDTO.getCpf())).thenReturn(false);
        when(repository.save(any())).thenReturn(patient);

        when(repository.getReferenceById(existingId)).thenReturn(patient);
        doThrow(EntityNotFoundException.class).when(repository).getReferenceById(nonExistingId);

        when(repository.existsById(existingId)).thenReturn(true);
        when(repository.existsById(nonExistingId)).thenReturn(false);
    }

    @Test
    void findAllPagedShouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        var result = service.findAllPaged(pageable);
        assertNotNull(result);
        verify(repository).findByActiveTrue(pageable);
    }

    @Test
    void findByIdShouldReturnPatientDTOWhenIdExists() {
        var result = service.findById(existingId);
        assertNotNull(result);
        assertEquals(patient.getCpf(), result.getCpf());
    }

    @Test
    void findByIdShouldThrowResourceNotFoundWhenIdDoesNotExist() {
        assertThrows(ResourceNotFoundException.class, () -> service.findById(nonExistingId));
    }

    @Test
    void insertShouldSavePatientWhenCpfIsUnique() {
        var result = service.insert(patientDTO);
        assertNotNull(result);
        verify(repository).save(any());
    }

    @Test
    void insertShouldThrowConflictExceptionWhenCpfExists() {
        when(repository.existsByCpf(patientDTO.getCpf())).thenReturn(true);
        assertThrows(ConflictException.class, () -> service.insert(patientDTO));
    }

    @Test
    void updateShouldReturnPatientDTOWhenIdExists() {
        var result = service.update(existingId, patientDTO);
        assertNotNull(result);
        verify(repository).save(any());
    }

    @Test
    void updateShouldThrowResourceNotFoundWhenIdDoesNotExist() {
        assertThrows(ResourceNotFoundException.class, () -> service.update(nonExistingId, patientDTO));
    }

    @Test
    void deactivateShouldSetActiveToFalseWhenIdExists() {
        service.deactivate(existingId);
        assertFalse(patient.getActive());
    }

    @Test
    void deactivateShouldThrowResourceNotFoundWhenIdDoesNotExist() {
        assertThrows(ResourceNotFoundException.class, () -> service.deactivate(nonExistingId));
    }

    @Test
    void deactivateShouldThrowConflictWhenDataIntegrityViolation() {
        when(repository.getReferenceById(existingId)).thenThrow(DataIntegrityViolationException.class);
        assertThrows(ConflictException.class, () -> service.deactivate(existingId));
    }
}
