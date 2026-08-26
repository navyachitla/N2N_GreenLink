package com.greenlink.controller;

import com.greenlink.dto.ServiceAndLearningDto.SustainabilityServiceDto;
import com.greenlink.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<SustainabilityServiceDto>> getActiveServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(serviceService.getActiveServices(category, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SustainabilityServiceDto> getServiceById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getServiceById(id));
    }
}
