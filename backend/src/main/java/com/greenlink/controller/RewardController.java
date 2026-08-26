package com.greenlink.controller;

import com.greenlink.dto.RewardDto.RewardSummaryResponse;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.RewardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {

    @Autowired
    private RewardService rewardService;

    @GetMapping
    public ResponseEntity<RewardSummaryResponse> getMyRewards(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(rewardService.getUserRewardSummary(currentUser.getId()));
    }
}
