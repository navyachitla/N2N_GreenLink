package com.greenlink.service;

import com.greenlink.dto.ServiceAndLearningDto.SustainabilityServiceDto;
import com.greenlink.entity.SustainabilityService;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.SustainabilityServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    @Autowired
    private SustainabilityServiceRepository serviceRepository;

    public List<SustainabilityServiceDto> getActiveServices(String category, String query) {
        List<SustainabilityService> list;
        if (query != null && !query.trim().isEmpty()) {
            list = serviceRepository.findByCategoryContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        } else {
            list = serviceRepository.findByActiveTrue();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public SustainabilityServiceDto getServiceById(Long id) {
        SustainabilityService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sustainability service not found with id " + id));
        return mapToDto(service);
    }

    // Admin Operations
    @Transactional
    public SustainabilityServiceDto createService(SustainabilityServiceDto dto) {
        SustainabilityService service = new SustainabilityService();
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setCategory(dto.getCategory());
        service.setLocation(dto.getLocation());
        service.setContactInfo(dto.getContactInfo());
        service.setAvailability(dto.getAvailability());
        service.setImageUrl(dto.getImageUrl());
        service.setActive(dto.isActive());

        service = serviceRepository.save(service);
        return mapToDto(service);
    }

    @Transactional
    public SustainabilityServiceDto updateService(Long id, SustainabilityServiceDto dto) {
        SustainabilityService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setCategory(dto.getCategory());
        service.setLocation(dto.getLocation());
        service.setContactInfo(dto.getContactInfo());
        service.setAvailability(dto.getAvailability());
        if (dto.getImageUrl() != null) {
            service.setImageUrl(dto.getImageUrl());
        }
        service.setActive(dto.isActive());

        service = serviceRepository.save(service);
        return mapToDto(service);
    }

    @Transactional
    public void deleteService(Long id) {
        SustainabilityService service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        serviceRepository.delete(service);
    }

    private SustainabilityServiceDto mapToDto(SustainabilityService s) {
        SustainabilityServiceDto dto = new SustainabilityServiceDto();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setDescription(s.getDescription());
        dto.setCategory(s.getCategory());
        dto.setLocation(s.getLocation());
        dto.setContactInfo(s.getContactInfo());
        dto.setAvailability(s.getAvailability());
        dto.setImageUrl(s.getImageUrl());
        dto.setActive(s.isActive());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }
}
