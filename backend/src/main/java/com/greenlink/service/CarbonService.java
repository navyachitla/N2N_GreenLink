package com.greenlink.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenlink.dto.CarbonDto.*;
import com.greenlink.entity.CarbonFootprint;
import com.greenlink.entity.User;
import com.greenlink.exception.ResourceNotFoundException;
import com.greenlink.repository.CarbonFootprintRepository;
import com.greenlink.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarbonService {

    @Autowired
    private CarbonFootprintRepository carbonRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RewardService rewardService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public CarbonFootprintResponse calculateFootprint(Long userId, CarbonCalculateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Standard emission factors
        double elecCo2 = request.getElectricityUsageKwh() * 0.85; // 0.85 kg CO2e/kWh
        double driveCo2 = request.getTransportationDistanceKm() * 0.17; // 0.17 kg CO2e/km
        double fuelCo2 = request.getFuelUsageLiters() * 2.31; // 2.31 kg CO2e/liter
        double transitCo2 = request.getPublicTransportKm() * 0.05; // 0.05 kg CO2e/km
        double wasteCo2 = request.getWasteGeneratedKg() * 0.50; // 0.50 kg CO2e/kg

        double total = elecCo2 + driveCo2 + fuelCo2 + transitCo2 + wasteCo2;
        // Round to 2 decimal places
        total = Math.round(total * 100.0) / 100.0;

        List<String> suggestions = generateSuggestions(request, total);
        String suggestionsJson = "";
        try {
            suggestionsJson = objectMapper.writeValueAsString(suggestions);
        } catch (Exception e) {
            suggestionsJson = "[\"Switch to LED bulbs\", \"Opt for public transit\"]";
        }

        CarbonFootprint footprint = new CarbonFootprint();
        footprint.setUser(user);
        footprint.setElectricityUsageKwh(request.getElectricityUsageKwh());
        footprint.setTransportationDistanceKm(request.getTransportationDistanceKm());
        footprint.setFuelUsageLiters(request.getFuelUsageLiters());
        footprint.setPublicTransportKm(request.getPublicTransportKm());
        footprint.setWasteGeneratedKg(request.getWasteGeneratedKg());
        footprint.setTotalFootprintKgCo2e(total);
        footprint.setSuggestionsJson(suggestionsJson);

        footprint = carbonRepository.save(footprint);

        // Award reward points for carbon tracking
        rewardService.addPoints(user, 25, "CALCULATE_CARBON", "Calculated carbon footprint: " + total + " kg CO2e");

        return mapToResponse(footprint, suggestions);
    }

    public List<CarbonFootprintResponse> getUserCarbonHistory(Long userId) {
        List<CarbonFootprint> history = carbonRepository.findByUserIdOrderByCalculationDateDesc(userId);
        return history.stream().map(f -> {
            List<String> suggestions = parseSuggestions(f.getSuggestionsJson());
            return mapToResponse(f, suggestions);
        }).collect(Collectors.toList());
    }

    public CarbonFootprintResponse getLatestFootprint(Long userId) {
        CarbonFootprint footprint = carbonRepository.findFirstByUserIdOrderByCalculationDateDesc(userId)
                .orElse(null);

        if (footprint == null) {
            return null;
        }
        return mapToResponse(footprint, parseSuggestions(footprint.getSuggestionsJson()));
    }

    private List<String> generateSuggestions(CarbonCalculateRequest req, double total) {
        List<String> suggestions = new ArrayList<>();
        if (req.getElectricityUsageKwh() > 150) {
            suggestions.add("⚡ High Electricity Usage: Consider switching to solar panels or energy-star rated appliances.");
        } else {
            suggestions.add("🌱 Great energy habits! Unplug phantom loads when not in use.");
        }

        if (req.getTransportationDistanceKm() > 100 || req.getFuelUsageLiters() > 30) {
            suggestions.add("🚗 High Personal Driving: Try carpooling, bicycling, or using electric vehicles for daily commutes.");
        }

        if (req.getPublicTransportKm() > 0) {
            suggestions.add("🚌 Kudos for using public transport! It reduces individual emissions by over 70%.");
        }

        if (req.getWasteGeneratedKg() > 20) {
            suggestions.add("♻️ High Waste Generation: Start composting organic waste and submit recyclable plastics/metals via GreenLink Waste Management.");
        }

        if (total > 500) {
            suggestions.add("🌍 Estimated Monthly Footprint is above average. Participate in local Eco-Events to plant trees!");
        } else {
            suggestions.add("🌟 Excellent sustainable score! Keep buying circular products in the GreenLink Marketplace.");
        }

        return suggestions;
    }

    private List<String> parseSuggestions(String json) {
        if (json == null || json.isEmpty()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return List.of("Reduce energy consumption", "Use public transportation", "Recycle waste");
        }
    }

    private CarbonFootprintResponse mapToResponse(CarbonFootprint f, List<String> suggestions) {
        CarbonFootprintResponse res = new CarbonFootprintResponse();
        res.setId(f.getId());
        res.setElectricityUsageKwh(f.getElectricityUsageKwh());
        res.setTransportationDistanceKm(f.getTransportationDistanceKm());
        res.setFuelUsageLiters(f.getFuelUsageLiters());
        res.setPublicTransportKm(f.getPublicTransportKm());
        res.setWasteGeneratedKg(f.getWasteGeneratedKg());
        res.setTotalFootprintKgCo2e(f.getTotalFootprintKgCo2e());
        res.setSuggestions(suggestions);
        res.setCalculationDate(f.getCalculationDate());
        return res;
    }
}
