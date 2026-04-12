package com.dawaalink.security;

import com.dawaalink.model.PharmacyUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Utility to extract the authenticated pharmacy context from the SecurityContext.
 * Eliminates the need for client-supplied Pharmacy-ID headers — the pharmacyId
 * is derived exclusively from the JWT-authenticated principal.
 */
@Component
public class SecurityContextUtil {

    /**
     * Returns the pharmacy ID of the currently authenticated user.
     * @throws SecurityException if no authenticated user is present
     */
    public UUID getCurrentPharmacyId() {
        return getCurrentUser().getPharmacy().getId();
    }

    /**
     * Returns the full PharmacyUser entity for the authenticated principal.
     */
    public PharmacyUser getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails details) {
            return details.getUser();
        }
        throw new SecurityException("No authenticated pharmacy user in security context");
    }

    /**
     * Returns the username (email) of the authenticated user.
     */
    public String getCurrentUsername() {
        return getCurrentUser().getEmail();
    }
}
