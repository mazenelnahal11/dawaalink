package com.dawaalink.service;

import com.dawaalink.dto.AuthResponse;
import com.dawaalink.dto.LoginRequest;
import com.dawaalink.dto.RegisterRequest;
import com.dawaalink.exception.BusinessRuleException;
import com.dawaalink.exception.ResourceNotFoundException;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.PharmacyUser;
import com.dawaalink.model.enums.PharmacyStatus;
import com.dawaalink.model.enums.Role;
import com.dawaalink.repository.PharmacyRepository;
import com.dawaalink.repository.PharmacyUserRepository;
import com.dawaalink.security.CustomUserDetails;
import com.dawaalink.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public AuthService(PharmacyRepository pharmacyRepository,
                       PharmacyUserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.pharmacyRepository = pharmacyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Transactional
    public Map<String, UUID> register(RegisterRequest request) {
        if (pharmacyRepository.findByTaxId(request.getCommercialRegNo()).isPresent()) {
            throw new BusinessRuleException("Pharmacy with this commercial registration already exists");
        }
        if (userRepository.findByEmailIgnoreCase(request.getEmail()).isPresent()) {
            throw new BusinessRuleException("Email already in use");
        }

        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setCommercialName(request.getPharmacyName());
        pharmacy.setDistrict(request.getDistrict());
        pharmacy.setAddress(request.getDistrict());
        pharmacy.setTaxId(request.getCommercialRegNo());
        pharmacy.setStatus(PharmacyStatus.PENDING);
        pharmacy = pharmacyRepository.save(pharmacy);

        PharmacyUser owner = new PharmacyUser();
        owner.setPharmacy(pharmacy);
        owner.setFullName(request.getOwnerName());
        owner.setEmail(request.getEmail());
        owner.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        owner.setRole(Role.OWNER);
        
        String verificationCode = String.format("%06d", new java.util.Random().nextInt(999999));
        owner.setVerificationCode(verificationCode);
        owner.setVerified(false);
        
        userRepository.save(owner);

        emailService.sendVerificationEmail(owner.getEmail(), verificationCode);

        return Map.of("pharmacyId", pharmacy.getId());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        PharmacyUser user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.isVerified()) {
            throw new BusinessRuleException("Please verify your email address before logging in.");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("pharmacyId", user.getPharmacy().getId().toString());

        String token = jwtUtil.generateToken(userDetails, claims);

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getPharmacy().getId(),
                user.getPharmacy().getStatus().name(),
                user.getPharmacy().getCommercialName(),
                user.getPharmacy().getDistrict(),
                user.getPharmacy().getProfileImageUrl()
        );
    }

    @Transactional
    public Map<String, String> activatePharmacy(UUID pharmacyId) {
        Pharmacy pharmacy = pharmacyRepository.findById(pharmacyId)
                .orElseThrow(() -> new ResourceNotFoundException("Pharmacy not found"));
        pharmacy.setStatus(PharmacyStatus.ACTIVE);
        pharmacyRepository.save(pharmacy);
        return Map.of("status", "ACTIVE");
    }

    @Transactional
    public void verifyAccount(String email, String code) {
        PharmacyUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (user.isVerified()) {
            throw new BusinessRuleException("Account is already verified");
        }

        if (!code.equals(user.getVerificationCode())) {
            throw new BusinessRuleException("Invalid verification code");
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        userRepository.save(user);
    }
}
