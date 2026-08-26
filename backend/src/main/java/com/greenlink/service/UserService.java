package com.greenlink.service;

import com.greenlink.dto.UserDto.*;
import com.greenlink.entity.User;
import com.greenlink.enums.RoleName;
import com.greenlink.exception.InvalidOperationException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        userRepository.save(user);
        return mapToProfileDto(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidOperationException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public List<UserProfileDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToProfileDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserProfileDto toggleUserActiveStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Do not allow deactivating root admin
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);
        if (isAdmin && user.getUsername().equalsIgnoreCase("admin")) {
            throw new InvalidOperationException("Cannot deactivate primary root admin account");
        }

        user.setActive(!user.isActive());
        userRepository.save(user);
        return mapToProfileDto(user);
    }

    public UserProfileDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return mapToProfileDto(user);
    }

    private UserProfileDto mapToProfileDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return new UserProfileDto(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRewardPoints(),
                user.isActive(),
                roles,
                user.getCreatedAt()
        );
    }
}
