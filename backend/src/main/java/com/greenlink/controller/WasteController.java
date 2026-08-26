package com.greenlink.controller;

import com.greenlink.dto.WasteDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.WasteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waste")
public class WasteController {

    @Autowired
    private WasteService wasteService;

    @PostMapping
    public ResponseEntity<WasteSubmissionResponse> submitWaste(@AuthenticationPrincipal UserPrincipal currentUser,
                                                                @Valid @RequestBody WasteSubmissionRequest request) {
        return ResponseEntity.ok(wasteService.submitWaste(currentUser.getId(), request));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<WasteSubmissionResponse>> getMySubmissions(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(wasteService.getUserWasteSubmissions(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WasteSubmissionResponse> getWasteById(@PathVariable Long id) {
        return ResponseEntity.ok(wasteService.getWasteById(id));
    }
}
