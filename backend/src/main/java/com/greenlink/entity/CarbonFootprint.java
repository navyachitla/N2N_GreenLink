package com.greenlink.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "carbon_footprints")
public class CarbonFootprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private double electricityUsageKwh;
    private double transportationDistanceKm;
    private double fuelUsageLiters;
    private double publicTransportKm;
    private double wasteGeneratedKg;

    private double totalFootprintKgCo2e;

    @Column(length = 2000)
    private String suggestionsJson;

    private LocalDateTime calculationDate;

    @PrePersist
    protected void onCreate() {
        this.calculationDate = LocalDateTime.now();
    }

    public CarbonFootprint() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getElectricityUsageKwh() {
        return electricityUsageKwh;
    }

    public void setElectricityUsageKwh(double electricityUsageKwh) {
        this.electricityUsageKwh = electricityUsageKwh;
    }

    public double getTransportationDistanceKm() {
        return transportationDistanceKm;
    }

    public void setTransportationDistanceKm(double transportationDistanceKm) {
        this.transportationDistanceKm = transportationDistanceKm;
    }

    public double getFuelUsageLiters() {
        return fuelUsageLiters;
    }

    public void setFuelUsageLiters(double fuelUsageLiters) {
        this.fuelUsageLiters = fuelUsageLiters;
    }

    public double getPublicTransportKm() {
        return publicTransportKm;
    }

    public void setPublicTransportKm(double publicTransportKm) {
        this.publicTransportKm = publicTransportKm;
    }

    public double getWasteGeneratedKg() {
        return wasteGeneratedKg;
    }

    public void setWasteGeneratedKg(double wasteGeneratedKg) {
        this.wasteGeneratedKg = wasteGeneratedKg;
    }

    public double getTotalFootprintKgCo2e() {
        return totalFootprintKgCo2e;
    }

    public void setTotalFootprintKgCo2e(double totalFootprintKgCo2e) {
        this.totalFootprintKgCo2e = totalFootprintKgCo2e;
    }

    public String getSuggestionsJson() {
        return suggestionsJson;
    }

    public void setSuggestionsJson(String suggestionsJson) {
        this.suggestionsJson = suggestionsJson;
    }

    public LocalDateTime getCalculationDate() {
        return calculationDate;
    }

    public void setCalculationDate(LocalDateTime calculationDate) {
        this.calculationDate = calculationDate;
    }
}
