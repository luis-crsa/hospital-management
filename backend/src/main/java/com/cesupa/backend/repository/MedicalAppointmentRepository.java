package com.cesupa.backend.repository;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cesupa.backend.domain.medicalAppointment.MedicalAppointment;

public interface MedicalAppointmentRepository extends JpaRepository<MedicalAppointment, Long>{
    boolean existsByDoctorIdAndDateTime(Long doctorId, LocalDateTime dateTime);
}
