package com.cesupa.backend.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.cesupa.backend.domain.patient.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long>{

    Page<Patient> findByActiveTrue(Pageable pageable);

    Optional<Patient> findByIdAndActiveTrue(Long id);
}
