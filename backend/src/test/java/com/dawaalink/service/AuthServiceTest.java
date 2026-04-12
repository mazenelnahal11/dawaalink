package com.dawaalink.service;

import com.dawaalink.dto.RegisterRequest;
import com.dawaalink.model.Pharmacy;
import com.dawaalink.model.PharmacyUser;
import com.dawaalink.repository.PharmacyRepository;
import com.dawaalink.repository.PharmacyUserRepository;
import com.dawaalink.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private PharmacyRepository pharmacyRepository;

    @Mock
    private PharmacyUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setPharmacyName("Test Pharmacy");
        registerRequest.setDistrict("Zayed");
        registerRequest.setOwnerName("John Doe");
        registerRequest.setCommercialRegNo("123456");
        registerRequest.setPharmacistContact("01000000000");
        registerRequest.setEmail("test@dawaalink.com");
        registerRequest.setPassword("securePassword");
    }

    @Test
    void register_Success() {
        when(pharmacyRepository.findByTaxId(any())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        
        Pharmacy mockPharmacy = new Pharmacy();
        mockPharmacy.setId(UUID.randomUUID());
        when(pharmacyRepository.save(any(Pharmacy.class))).thenReturn(mockPharmacy);

        Map<String, UUID> response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals(mockPharmacy.getId(), response.get("pharmacyId"));
        
        verify(pharmacyRepository).save(any(Pharmacy.class));
        verify(userRepository).save(any(PharmacyUser.class));
    }

    @Test
    void register_DuplicateTaxId_ThrowsException() {
        when(pharmacyRepository.findByTaxId(any())).thenReturn(Optional.of(new Pharmacy()));

        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        assertEquals("Pharmacy with this commercial registration already exists", exception.getMessage());
        
        verify(pharmacyRepository, never()).save(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        when(pharmacyRepository.findByTaxId(any())).thenReturn(Optional.empty());
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(new PharmacyUser()));

        Exception exception = assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        assertEquals("Email already in use", exception.getMessage());
        
        verify(pharmacyRepository, never()).save(any());
        verify(userRepository, never()).save(any());
    }
}
