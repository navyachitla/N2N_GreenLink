package com.greenlink.service;

import com.greenlink.dto.AuthDto.*;
import com.greenlink.dto.UserDto.UserProfileDto;
import com.greenlink.entity.Role;
import com.greenlink.entity.User;
import com.greenlink.enums.RoleName;
import com.greenlink.exception.DuplicateResourceException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.RoleRepository;
import com.greenlink.repository.UserRepository;
import com.greenlink.security.JwtUtils;
import com.greenlink.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        User user = userRepository.findById(userDetails.getId()).orElseThrow();

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getFullName(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles,
                user.getRewardPoints()
        );
    }

    @Transactional
    public MessageResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email is already registered!");
        }

        User user = new User(
                registerRequest.getFullName(),
                registerRequest.getUsername(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()),
                registerRequest.getPhone(),
                registerRequest.getAddress()
        );

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Error: Role ROLE_USER is not initialized in DB."));
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        return new MessageResponse("User registered successfully!", true);
    }

    public UserProfileDto getCurrentUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

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
