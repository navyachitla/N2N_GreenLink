package com.greenlink.dto;

import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import java.util.List;

public class CarbonDto {

    public static class CarbonCalculateRequest {
        @Min(value = 0, message = "Electricity usage cannot be negative")
        private double electricityUsageKwh;

        @Min(value = 0, message = "Transportation distance cannot be negative")
        private double transportationDistanceKm;

        @Min(value = 0, message = "Fuel usage cannot be negative")
        private double fuelUsageLiters;

        @Min(value = 0, message = "Public transport distance cannot be negative")
        private double publicTransportKm;

        @Min(value = 0, message = "Waste generated cannot be negative")
        private double wasteGeneratedKg;

        public CarbonCalculateRequest() {}

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
    }

    public static class CarbonFootprintResponse {
        private Long id;
        private double electricityUsageKwh;
        private double transportationDistanceKm;
        private double fuelUsageLiters;
        private double publicTransportKm;
        private double wasteGeneratedKg;
        private double totalFootprintKgCo2e;
        private List<String> suggestions;
        private LocalDateTime calculationDate;

        public CarbonFootprintResponse() {}

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
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

        public List<String> getSuggestions() {
            return suggestions;
        }

        public void setSuggestions(List<String> suggestions) {
            this.suggestions = suggestions;
        }

        public LocalDateTime getCalculationDate() {
            return calculationDate;
        }

        public void setCalculationDate(LocalDateTime calculationDate) {
            this.calculationDate = calculationDate;
        }
    }
}
