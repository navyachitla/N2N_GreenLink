package com.greenlink.controller;

import com.greenlink.dto.CarbonDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.CarbonService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carbon")
public class CarbonController {

    @Autowired
    private CarbonService carbonService;

    @PostMapping("/calculate")
    public ResponseEntity<CarbonFootprintResponse> calculateFootprint(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CarbonCalculateRequest request) {
        return ResponseEntity.ok(carbonService.calculateFootprint(currentUser.getId(), request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<CarbonFootprintResponse>> getCarbonHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(carbonService.getUserCarbonHistory(currentUser.getId()));
    }

    @GetMapping("/latest")
    public ResponseEntity<CarbonFootprintResponse> getLatestFootprint(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(carbonService.getLatestFootprint(currentUser.getId()));
    }
}
