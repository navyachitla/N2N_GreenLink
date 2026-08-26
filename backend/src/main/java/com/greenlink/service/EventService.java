package com.greenlink.service;

import com.greenlink.dto.EventDto.*;
import com.greenlink.entity.EcoEvent;
import com.greenlink.entity.EventRegistration;
import com.greenlink.entity.User;
import com.greenlink.enums.EventStatus;
import com.greenlink.exception.DuplicateResourceException;
import com.greenlink.exception.InvalidOperationException;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.EcoEventRepository;
import com.greenlink.repository.EventRegistrationRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EcoEventRepository eventRepository;

    @Autowired
    private EventRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    public List<EcoEventDto> getAllEvents(Long userId) {
        List<EcoEvent> events = eventRepository.findAllByOrderByEventDateAsc();
        return events.stream().map(e -> mapToDto(e, userId)).collect(Collectors.toList());
    }

    public EcoEventDto getEventById(Long id, Long userId) {
        EcoEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Eco event not found with id " + id));
        return mapToDto(event, userId);
    }

    @Transactional
    public EventRegistrationResponse registerForEvent(Long eventId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        EcoEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Eco event not found"));

        if (event.getStatus() == EventStatus.CANCELLED || event.getStatus() == EventStatus.COMPLETED) {
            throw new InvalidOperationException("Event is not open for registration");
        }

        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new DuplicateResourceException("You are already registered for this event");
        }

        if (event.getRegisteredCount() >= event.getCapacity()) {
            throw new InvalidOperationException("Event capacity reached. Cannot register further participants.");
        }

        EventRegistration registration = new EventRegistration(user, event);
        registration = registrationRepository.save(registration);

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        // Award reward points for event participation
        rewardService.addPoints(user, 20, "EVENT_REGISTRATION", "Registered for eco-event: " + event.getTitle());

        return new EventRegistrationResponse(
                registration.getId(),
                event.getId(),
                event.getTitle(),
                user.getId(),
                registration.getRegisteredAt()
        );
    }

    @Transactional
    public void cancelRegistration(Long eventId, Long userId) {
        EventRegistration registration = registrationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for this event"));

        EcoEvent event = registration.getEvent();
        registrationRepository.delete(registration);

        if (event.getRegisteredCount() > 0) {
            event.setRegisteredCount(event.getRegisteredCount() - 1);
            eventRepository.save(event);
        }
    }

    public List<EcoEventDto> getUserRegisteredEvents(Long userId) {
        List<EventRegistration> registrations = registrationRepository.findByUserId(userId);
        return registrations.stream()
                .map(r -> mapToDto(r.getEvent(), userId))
                .collect(Collectors.toList());
    }

    // Admin Operations
    @Transactional
    public EcoEventDto createEvent(EcoEventDto dto) {
        EcoEvent event = new EcoEvent();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setLocation(dto.getLocation());
        event.setCapacity(dto.getCapacity());
        event.setOrganizer(dto.getOrganizer());
        event.setStatus(dto.getStatus() != null ? dto.getStatus() : EventStatus.UPCOMING);
        event.setImageUrl(dto.getImageUrl());

        event = eventRepository.save(event);
        return mapToDto(event, null);
    }

    @Transactional
    public EcoEventDto updateEvent(Long id, EcoEventDto dto) {
        EcoEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Eco event not found"));

        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setEventTime(dto.getEventTime());
        event.setLocation(dto.getLocation());
        event.setCapacity(dto.getCapacity());
        event.setOrganizer(dto.getOrganizer());
        if (dto.getStatus() != null) {
            event.setStatus(dto.getStatus());
        }
        if (dto.getImageUrl() != null) {
            event.setImageUrl(dto.getImageUrl());
        }

        event = eventRepository.save(event);
        return mapToDto(event, null);
    }

    @Transactional
    public void deleteEvent(Long id) {
        EcoEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Eco event not found"));
        eventRepository.delete(event);
    }

    private EcoEventDto mapToDto(EcoEvent event, Long userId) {
        EcoEventDto dto = new EcoEventDto();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setEventTime(event.getEventTime());
        dto.setLocation(event.getLocation());
        dto.setCapacity(event.getCapacity());
        dto.setRegisteredCount(event.getRegisteredCount());
        dto.setOrganizer(event.getOrganizer());
        dto.setStatus(event.getStatus());
        dto.setImageUrl(event.getImageUrl());
        dto.setCreatedAt(event.getCreatedAt());

        if (userId != null) {
            dto.setRegistered(registrationRepository.existsByUserIdAndEventId(userId, event.getId()));
        } else {
            dto.setRegistered(false);
        }

        return dto;
    }
}
