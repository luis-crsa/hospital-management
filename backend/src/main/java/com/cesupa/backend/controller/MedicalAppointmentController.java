package com.cesupa.backend.controller;

import com.cesupa.backend.domain.medicalAppointment.MedicalAppointmentDTO;
import com.cesupa.backend.service.MedicalAppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class MedicalAppointmentController {

    @Autowired
    private MedicalAppointmentService service;

    @GetMapping
    public ResponseEntity<List<MedicalAppointmentDTO>> findAll(){
        List<MedicalAppointmentDTO> list = service.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/schedule")
    public ResponseEntity<MedicalAppointmentDTO> schedule(@Valid @RequestBody MedicalAppointmentDTO dto){
        dto = service.schedule(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }
}
