package com.greenlink.controller;

import com.greenlink.dto.AuthDto.MessageResponse;
import com.greenlink.dto.EventDto.*;
import com.greenlink.security.UserPrincipal;
import com.greenlink.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<EcoEventDto>> getAllEvents(@AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        return ResponseEntity.ok(eventService.getAllEvents(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EcoEventDto> getEventById(@PathVariable Long id,
                                                     @AuthenticationPrincipal UserPrincipal currentUser) {
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        return ResponseEntity.ok(eventService.getEventById(id, userId));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<EventRegistrationResponse> registerForEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(eventService.registerForEvent(id, currentUser.getId()));
    }

    @DeleteMapping("/{id}/register")
    public ResponseEntity<MessageResponse> cancelRegistration(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        eventService.cancelRegistration(id, currentUser.getId());
        return ResponseEntity.ok(new MessageResponse("Registration cancelled successfully", true));
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EcoEventDto>> getMyEvents(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(eventService.getUserRegisteredEvents(currentUser.getId()));
    }
}
