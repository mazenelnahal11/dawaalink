package com.dawaalink.security;

import com.dawaalink.model.PharmacyUser;
import com.dawaalink.model.enums.PharmacyStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final PharmacyUser user;

    public CustomUserDetails(PharmacyUser user) {
        this.user = user;
    }

    public PharmacyUser getUser() {
        return user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Allow login for ACTIVE and PENDING pharmacies.
        // This allows newly registered/verified users to see their dashboard while waiting for admin approval.
        PharmacyStatus status = user.getPharmacy().getStatus();
        return status == PharmacyStatus.ACTIVE || status == PharmacyStatus.PENDING;
    }
}
