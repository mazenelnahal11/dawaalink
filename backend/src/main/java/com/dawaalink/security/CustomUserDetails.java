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
        // Only ACTIVE pharmacy users may authenticate.
        // PENDING users must wait for admin approval.
        return user.getPharmacy().getStatus() == PharmacyStatus.ACTIVE;
    }
}
