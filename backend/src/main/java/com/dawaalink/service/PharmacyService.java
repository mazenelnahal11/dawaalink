package com.dawaalink.service;

import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.repository.PharmacyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PharmacyService {

    private final PharmacyRepository pharmacyRepository;

    public PharmacyService(PharmacyRepository pharmacyRepository) {
        this.pharmacyRepository = pharmacyRepository;
    }

    @Transactional
    public String updateProfileImage(UUID pharmacyId, String imageUrl) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));
        pharmacy.setProfileImageUrl(imageUrl);
        pharmacyRepository.save(pharmacy);
        return imageUrl;
    }

    public Pharmacy getPharmacy(UUID pharmacyId) {
        return pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));
    }
}
