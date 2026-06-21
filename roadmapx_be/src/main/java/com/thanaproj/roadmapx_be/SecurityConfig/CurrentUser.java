package com.thanaproj.roadmapx_be.SecurityConfig;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import com.thanaproj.roadmapx_be.Service.CustomUserDetails.CustomUserDetails;


@Component
public class CurrentUser {
    public CustomUserDetails getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null || !authentication.isAuthenticated()) return null;
        return (CustomUserDetails) authentication.getPrincipal();
    }
}
