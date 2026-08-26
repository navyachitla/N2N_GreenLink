package com.greenlink.controller;

import com.greenlink.dto.AdminDto.*;
import com.greenlink.dto.AuthDto.MessageResponse;
import com.greenlink.dto.EventDto.EcoEventDto;
import com.greenlink.dto.OrderDto.OrderResponse;
import com.greenlink.dto.ProductDto.ProductResponse;
import com.greenlink.dto.ServiceAndLearningDto.LearningResourceDto;
import com.greenlink.dto.ServiceAndLearningDto.SustainabilityServiceDto;
import com.greenlink.dto.UserDto.UserProfileDto;
import com.greenlink.dto.WasteDto.WasteStatusUpdateRequest;
import com.greenlink.dto.WasteDto.WasteSubmissionResponse;
import com.greenlink.enums.OrderStatus;
import com.greenlink.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private WasteService wasteService;

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private LearningService learningService;

    @Autowired
    private EventService eventService;

    // Platform Dashboard Statistics
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardStats> getDashboardStats() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<UserProfileDto> toggleUserActiveStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserActiveStatus(id));
    }

    // Product Management
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }

    @GetMapping("/products/pending")
    public ResponseEntity<List<ProductResponse>> getPendingProducts() {
        return ResponseEntity.ok(productService.getPendingProducts());
    }

    @PutMapping("/products/{id}/approval")
    public ResponseEntity<ProductResponse> approveOrRejectProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductApprovalRequest request) {
        return ResponseEntity.ok(productService.updateProductStatus(id, request.getStatus(), request.getRejectionReason()));
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    // Waste Management
    @GetMapping("/waste")
    public ResponseEntity<List<WasteSubmissionResponse>> getAllWasteSubmissions() {
        return ResponseEntity.ok(wasteService.getAllWasteSubmissionsForAdmin());
    }

    @PutMapping("/waste/{id}/status")
    public ResponseEntity<WasteSubmissionResponse> updateWasteStatus(
            @PathVariable Long id,
            @Valid @RequestBody WasteStatusUpdateRequest request) {
        return ResponseEntity.ok(wasteService.updateWasteStatus(id, request.getStatus(), request.getAdminNotes()));
    }

    // Service Content Management
    @PostMapping("/services")
    public ResponseEntity<SustainabilityServiceDto> createService(@Valid @RequestBody SustainabilityServiceDto dto) {
        return ResponseEntity.ok(serviceService.createService(dto));
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<SustainabilityServiceDto> updateService(
            @PathVariable Long id,
            @Valid @RequestBody SustainabilityServiceDto dto) {
        return ResponseEntity.ok(serviceService.updateService(id, dto));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<MessageResponse> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok(new MessageResponse("Service deleted successfully", true));
    }

    // Learning Content Management
    @PostMapping("/learning")
    public ResponseEntity<LearningResourceDto> createLearningResource(@Valid @RequestBody LearningResourceDto dto) {
        return ResponseEntity.ok(learningService.createResource(dto));
    }

    @PutMapping("/learning/{id}")
    public ResponseEntity<LearningResourceDto> updateLearningResource(
            @PathVariable Long id,
            @Valid @RequestBody LearningResourceDto dto) {
        return ResponseEntity.ok(learningService.updateResource(id, dto));
    }

    @DeleteMapping("/learning/{id}")
    public ResponseEntity<MessageResponse> deleteLearningResource(@PathVariable Long id) {
        learningService.deleteResource(id);
        return ResponseEntity.ok(new MessageResponse("Learning resource deleted successfully", true));
    }

    // Eco-Event Management
    @PostMapping("/events")
    public ResponseEntity<EcoEventDto> createEvent(@Valid @RequestBody EcoEventDto dto) {
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<EcoEventDto> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EcoEventDto dto) {
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<MessageResponse> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully", true));
    }
}
