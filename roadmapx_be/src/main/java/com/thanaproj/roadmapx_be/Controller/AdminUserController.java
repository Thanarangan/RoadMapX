package com.thanaproj.roadmapx_be.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanaproj.roadmapx_be.Dtos.UserRegReq;
import com.thanaproj.roadmapx_be.Service.AuthService;

@RestController
@RequestMapping("/admin")
public class AdminUserController {

    private final AuthService authService;

    AdminUserController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/content-managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createContentManager(@RequestBody UserRegReq user) {
        return authService.createContentManager(user);
    }
}
