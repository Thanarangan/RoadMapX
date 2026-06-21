package com.thanaproj.roadmapx_be.Service;

import com.thanaproj.roadmapx_be.APIResponse.AuthResponse;
import com.thanaproj.roadmapx_be.Dtos.UserLoginReq;
import com.thanaproj.roadmapx_be.Dtos.UserRegReq;
import com.thanaproj.roadmapx_be.Enum.CMStatus;
import com.thanaproj.roadmapx_be.Enum.Role;
import com.thanaproj.roadmapx_be.Model.User;
import com.thanaproj.roadmapx_be.Repository.UserRepo;
import com.thanaproj.roadmapx_be.Service.JwtService.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    AuthService(PasswordEncoder passwordEncoder, JwtService jwtService, UserRepo userRepo, AuthenticationManager authenticationManager) {
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
    }

    public ResponseEntity<String> registerUser(UserRegReq user) {
        return createUser(user, Role.ROLE_STUDENT, "User Registered Successfully!");
    }

    public ResponseEntity<String> createContentManager(UserRegReq user) {
        return createUser(user, Role.ROLE_CONTENT_MANAGER, "Content manager created successfully!");
    }

    private ResponseEntity<String> createUser(UserRegReq user, Role role, String successMessage) {
        if (userRepo.existsByuemail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }
        User newUser = new User();
        newUser.setUname(user.getUsername());
        newUser.setUemail(user.getEmail());
        newUser.setUpassword(passwordEncoder.encode(user.getPassword()));
        newUser.setUrole(role);
        newUser.setUstatus(CMStatus.ACTIVE);
        userRepo.save(newUser);
        return ResponseEntity.ok(successMessage);
    }

    public ResponseEntity<AuthResponse> loginUser(UserLoginReq user) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        if (!authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new AuthResponse("null", "Invalid credentials", null, null));
        }

        User loggedInUser = userRepo.findByuemail(user.getEmail());
        Role role = authentication.getAuthorities().stream()
            .findFirst()
            .map(grantedAuthority -> Role.valueOf(grantedAuthority.getAuthority()))
            .orElse(null);

        return ResponseEntity.status(200).body(
            new AuthResponse(jwtService.generateToken(user.getEmail()), "Login Successfully!", role, loggedInUser.getUname())
        );
    }
}
