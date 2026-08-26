package com.greenlink.service;

import com.greenlink.dto.ServiceAndLearningDto.LearningResourceDto;
import com.greenlink.entity.LearningResource;
import com.greenlink.entity.User;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.LearningResourceRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LearningService {

    @Autowired
    private LearningResourceRepository learningRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    public List<LearningResourceDto> getAllResources(String category, String query) {
        List<LearningResource> list;
        if (query != null && !query.trim().isEmpty()) {
            list = learningRepository.findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query);
        } else if (category != null && !category.trim().isEmpty()) {
            list = learningRepository.findByCategory(category);
        } else {
            list = learningRepository.findAll();
        }
        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public LearningResourceDto getResourceById(Long id, Long userId) {
        LearningResource resource = learningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found with id " + id));

        if (userId != null) {
            userRepository.findById(userId).ifPresent(user -> {
                rewardService.addPoints(user, 10, "READ_ARTICLE", "Read educational article: " + resource.getTitle());
            });
        }

        return mapToDto(resource);
    }

    // Admin Operations
    @Transactional
    public LearningResourceDto createResource(LearningResourceDto dto) {
        LearningResource resource = new LearningResource();
        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setCategory(dto.getCategory());
        resource.setContent(dto.getContent());
        resource.setImageUrl(dto.getImageUrl());
        resource.setExternalReference(dto.getExternalReference());

        resource = learningRepository.save(resource);
        return mapToDto(resource);
    }

    @Transactional
    public LearningResourceDto updateResource(Long id, LearningResourceDto dto) {
        LearningResource resource = learningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));

        resource.setTitle(dto.getTitle());
        resource.setDescription(dto.getDescription());
        resource.setCategory(dto.getCategory());
        resource.setContent(dto.getContent());
        if (dto.getImageUrl() != null) {
            resource.setImageUrl(dto.getImageUrl());
        }
        resource.setExternalReference(dto.getExternalReference());

        resource = learningRepository.save(resource);
        return mapToDto(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        LearningResource resource = learningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Learning resource not found"));
        learningRepository.delete(resource);
    }

    private LearningResourceDto mapToDto(LearningResource r) {
        LearningResourceDto dto = new LearningResourceDto();
        dto.setId(r.getId());
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setCategory(r.getCategory());
        dto.setContent(r.getContent());
        dto.setImageUrl(r.getImageUrl());
        dto.setExternalReference(r.getExternalReference());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
