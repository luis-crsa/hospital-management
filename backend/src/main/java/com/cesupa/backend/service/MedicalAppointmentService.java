package com.cesupa.backend.service;

import com.cesupa.backend.domain.doctor.Doctor;
import com.cesupa.backend.domain.medicalAppointment.AppointmentStatus;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointment;
import com.cesupa.backend.domain.medicalAppointment.MedicalAppointmentDTO;
import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.repository.DoctorRepository;
import com.cesupa.backend.repository.MedicalAppointmentRepository;
import com.cesupa.backend.repository.PatientRepository;
import com.cesupa.backend.service.exceptions.ConflictException;
import com.cesupa.backend.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class MedicalAppointmentService {

    @Autowired
    private MedicalAppointmentRepository medicalAppointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Transactional(readOnly = true)
    public List<MedicalAppointmentDTO> findAll(){
        return medicalAppointmentRepository.findAll().stream().map(MedicalAppointmentDTO::new).toList();
    }

    @Transactional
    public MedicalAppointmentDTO schedule(MedicalAppointmentDTO dto){
        MedicalAppointment entity = new MedicalAppointment();

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Médico não encontrado"));
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado"));

        if (dto.getDateTime().toLocalTime().isBefore(doctor.getWorkStart()) ||
                dto.getDateTime().toLocalTime().equals(doctor.getWorkEnd()) ||
                dto.getDateTime().toLocalTime().isAfter(doctor.getWorkEnd())) {
            throw new ConflictException("Consulta fora do horário de expediente do médico.");
        }

        if (medicalAppointmentRepository.existsByDoctorIdAndDateTime(doctor.getId(), dto.getDateTime())) {
            throw new ConflictException("Horário indisponível para este médico.");
        }

        entity.setDoctor(doctor);
        entity.setPatient(patient);
        entity.setDateTime(dto.getDateTime());
        entity.setReason(dto.getReason());
        entity.setStatus(AppointmentStatus.SCHEDULED);
        entity = medicalAppointmentRepository.save(entity);
        return new MedicalAppointmentDTO(entity);
    }
}
