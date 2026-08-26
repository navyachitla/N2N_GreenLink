package com.greenlink.controller;

import com.greenlink.dto.ServiceAndLearningDto.LearningResourceDto;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.LearningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning")
public class LearningController {

    @Autowired
    private LearningService learningService;

    @GetMapping
    public ResponseEntity<List<LearningResourceDto>> getAllResources(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(learningService.getAllResources(category, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningResourceDto> getResourceById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        return ResponseEntity.ok(learningService.getResourceById(id, userId));
    }
}
