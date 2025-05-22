package com.cesupa.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cesupa.backend.domain.patient.Patient;
import com.cesupa.backend.domain.patient.PatientDTO;
import com.cesupa.backend.repository.PatientRepository;
import com.cesupa.backend.service.exceptions.ConflictException;
import com.cesupa.backend.service.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repository;

    @Transactional(readOnly = true)
    public Page<PatientDTO> findAllPaged(Pageable pageable){
        return repository.findByActiveTrue(pageable).map(PatientDTO::new);
    }

    @Transactional(readOnly = true)
    public PatientDTO findById(Long id){
        Patient entity = repository.findByIdAndActiveTrue(id).orElseThrow(() -> new ResourceNotFoundException("Nenhum usuário encontrado"));
        return new PatientDTO(entity);
    }

    @Transactional
    public PatientDTO insert(PatientDTO dto){
        try {
            Patient entity = new Patient();
            copyDtoToEntity(entity, dto);
            return new PatientDTO(repository.save(entity));
        } catch (DataIntegrityViolationException e) {
            throw new ConflictException("CPF já cadastrado");
        }
    }

    @Transactional
    public PatientDTO update(Long id, PatientDTO dto){
        try{
            Patient entity = repository.getReferenceById(id);
            copyDtoToEntity(entity, dto);
            return new PatientDTO(repository.save(entity));
        } catch (EntityNotFoundException e) {
            throw new ResourceNotFoundException("Nenhum usuário encontrado");
        }
    }

    @Transactional
    public void delete(Long id){
        if(!repository.existsById(id)){
            throw new ResourceNotFoundException("Nenhum usuário encontrado");
        }
        try{
            Patient entity = repository.getReferenceById(id);
            entity.setActive(false);
        }catch (DataIntegrityViolationException e) {
            throw new ConflictException("O paciente possui consultas agendadas. Cancele-as antes de inativar o paciente");
        }
    }

    private void copyDtoToEntity(Patient entity, PatientDTO dto){
        entity.setFullName(dto.getFullName());
        entity.setBirthDate(dto.getBirthDate());
        entity.setCpf(dto.getCpf());
        entity.setGender(dto.getGender());
        entity.setPhone(dto.getPhone());
        entity.setAddress(dto.getAddress());
        entity.setEmail(dto.getEmail());
        entity.setBloodType(dto.getBloodType());
        entity.setKnownAllergies(dto.getKnownAllergies());
        entity.setActive(true);
    }
}
