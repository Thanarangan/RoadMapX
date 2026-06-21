package com.thanaproj.roadmapx_be.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thanaproj.roadmapx_be.Dtos.UserRegReq;
import com.thanaproj.roadmapx_be.Dtos.UserLoginReq;
import com.thanaproj.roadmapx_be.APIResponse.AuthResponse;
import com.thanaproj.roadmapx_be.Service.AuthService;

@RestController
public class AuthController {
    
    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRegReq user){
        return authService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody UserLoginReq user){
        return authService.loginUser(user);
    }
}
