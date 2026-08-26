package com.greenlink.controller;

import com.greenlink.dto.AuthDto.MessageResponse;
import com.greenlink.dto.UserDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(userService.getUserById(currentUser.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@AuthenticationPrincipal UserPrincipal currentUser,
                                                         @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@AuthenticationPrincipal UserPrincipal currentUser,
                                                           @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(new MessageResponse("Password updated successfully!", true));
    }
}
