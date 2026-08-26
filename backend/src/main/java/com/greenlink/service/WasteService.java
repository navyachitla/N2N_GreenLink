package com.greenlink.service;

import com.greenlink.dto.WasteDto.*;
import com.greenlink.entity.User;
import com.greenlink.entity.WasteSubmission;
import com.greenlink.enums.WasteStatus;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.UserRepository;
import com.greenlink.repository.WasteSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WasteService {

    @Autowired
    private WasteSubmissionRepository wasteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    @Transactional
    public WasteSubmissionResponse submitWaste(Long userId, WasteSubmissionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WasteSubmission waste = new WasteSubmission();
        waste.setUser(user);
        waste.setWasteType(request.getWasteType());
        waste.setDescription(request.getDescription());
        waste.setImageUrl(request.getImageUrl());
        waste.setQuantity(request.getQuantity());
        waste.setLocation(request.getLocation());
        waste.setPreferredAction(request.getPreferredAction());
        waste.setStatus(WasteStatus.SUBMITTED);

        waste = wasteRepository.save(waste);

        // Award preliminary points for waste log creation
        rewardService.addPoints(user, 15, "WASTE_SUBMISSION", "Submitted waste for " + request.getPreferredAction().name().toLowerCase());

        return mapToResponse(waste);
    }

    public List<WasteSubmissionResponse> getUserWasteSubmissions(Long userId) {
        return wasteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public WasteSubmissionResponse getWasteById(Long id) {
        WasteSubmission waste = wasteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Waste submission not found with id " + id));
        return mapToResponse(waste);
    }

    // Admin Operations
    public List<WasteSubmissionResponse> getAllWasteSubmissionsForAdmin() {
        return wasteRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WasteSubmissionResponse updateWasteStatus(Long wasteId, WasteStatus status, String adminNotes) {
        WasteSubmission waste = wasteRepository.findById(wasteId)
                .orElseThrow(() -> new ResourceNotFoundException("Waste submission not found"));

        WasteStatus previousStatus = waste.getStatus();
        waste.setStatus(status);
        if (adminNotes != null) {
            waste.setAdminNotes(adminNotes);
        }

        waste = wasteRepository.save(waste);

        // If completed by admin, award bonus +50 points
        if (status == WasteStatus.COMPLETED && previousStatus != WasteStatus.COMPLETED) {
            rewardService.addPoints(waste.getUser(), 50, "RECYCLING_COMPLETED", "Completed waste recycling/donation request #" + waste.getId());
        }

        return mapToResponse(waste);
    }

    private WasteSubmissionResponse mapToResponse(WasteSubmission waste) {
        WasteSubmissionResponse res = new WasteSubmissionResponse();
        res.setId(waste.getId());
        if (waste.getUser() != null) {
            res.setUserId(waste.getUser().getId());
            res.setUserName(waste.getUser().getFullName());
        }
        res.setWasteType(waste.getWasteType());
        res.setDescription(waste.getDescription());
        res.setImageUrl(waste.getImageUrl());
        res.setQuantity(waste.getQuantity());
        res.setLocation(waste.getLocation());
        res.setPreferredAction(waste.getPreferredAction());
        res.setStatus(waste.getStatus());
        res.setAdminNotes(waste.getAdminNotes());
        res.setCreatedAt(waste.getCreatedAt());
        return res;
    }
}
