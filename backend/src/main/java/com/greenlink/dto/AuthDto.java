package com.greenlink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class AuthDto {

    public static class LoginRequest {
        @NotBlank(message = "Username or email is required")
        private String usernameOrEmail;

        @NotBlank(message = "Password is required")
        private String password;

        public LoginRequest() {}

        public String getUsernameOrEmail() {
            return usernameOrEmail;
        }

        public void setUsernameOrEmail(String usernameOrEmail) {
            this.usernameOrEmail = usernameOrEmail;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RegisterRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
        private String username;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
        private String address;

        public RegisterRequest() {}

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String fullName;
        private String username;
        private String email;
        private List<String> roles;
        private int rewardPoints;

        public JwtResponse(String token, Long id, String fullName, String username, String email, List<String> roles, int rewardPoints) {
            this.token = token;
            this.id = id;
            this.fullName = fullName;
            this.username = username;
            this.email = email;
            this.roles = roles;
            this.rewardPoints = rewardPoints;
        }

        public String getToken() {
            return token;
        }

        public String getType() {
            return type;
        }

        public Long getId() {
            return id;
        }

        public String getFullName() {
            return fullName;
        }

        public String getUsername() {
            return username;
        }

        public String getEmail() {
            return email;
        }

        public List<String> getRoles() {
            return roles;
        }

        public int getRewardPoints() {
            return rewardPoints;
        }
    }

    public static class MessageResponse {
        private String message;
        private boolean success;

        public MessageResponse(String message, boolean success) {
            this.message = message;
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public boolean isSuccess() {
            return success;
        }
    }
}
