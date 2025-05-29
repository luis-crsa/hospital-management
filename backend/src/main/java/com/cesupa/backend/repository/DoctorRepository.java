package com.cesupa.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cesupa.backend.domain.doctor.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long>{

}
