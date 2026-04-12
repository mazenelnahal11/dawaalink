package com.dawaalink.controller;

import com.dawaalink.dto.AuthResponse;
import com.dawaalink.dto.LoginRequest;
import com.dawaalink.dto.RegisterRequest;
import com.dawaalink.security.SecurityContextUtil;
import com.dawaalink.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, UUID>> register(@Valid @RequestBody RegisterRequest request) {
        // BusinessRuleException (409) is thrown by AuthService if duplicate;
        // GlobalExceptionHandler maps it to a structured JSON response.
        Map<String, UUID> response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Activation restricted to ADMIN role only.
     * Owners cannot self-activate — an admin review workflow is enforced.
     */
    @PostMapping("/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> activate(@RequestBody Map<String, String> body) {
        UUID pharmacyId = UUID.fromString(body.get("pharmacyId"));
        return ResponseEntity.ok(authService.activatePharmacy(pharmacyId));
    }
}
