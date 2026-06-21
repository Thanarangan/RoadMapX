package com.thanaproj.roadmapx_be.Service.CustomUserDetails;

import java.util.Collection;
import java.util.Collections;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.thanaproj.roadmapx_be.Model.User;

public class CustomUserDetails implements UserDetails {

    private final User user;
    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority(user.getUrole().name()));
    }

    @Override
    public @Nullable String getPassword() {
        return user.getUpassword();
    }

    @Override
    public String getUsername() {
        return user.getUemail();
    }

    public Long getId() {
        return user.getUid();
    }
}
