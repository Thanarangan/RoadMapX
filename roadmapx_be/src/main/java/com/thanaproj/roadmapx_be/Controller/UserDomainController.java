package com.thanaproj.roadmapx_be.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Service.UserDomainService;

@RestController
@RequestMapping("/api/domainservices")
public class UserDomainController {
    
    private final UserDomainService userDomainService;

    UserDomainController(UserDomainService userDomainService) {
        this.userDomainService = userDomainService;
    }

    @PostMapping("/addDomainToUser/{domainId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<String> addDomainToUser(@PathVariable Long domainId){
        return ResponseEntity.ok(userDomainService.assignDomainToUser(domainId));
    }

    @GetMapping("/current")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Domain> getCurrentDomain(){
        return ResponseEntity.ok(userDomainService.getCurrentDomain());
    }
}
