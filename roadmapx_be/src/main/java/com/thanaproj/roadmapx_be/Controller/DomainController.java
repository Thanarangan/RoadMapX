package com.thanaproj.roadmapx_be.Controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thanaproj.roadmapx_be.Dtos.DomainAddReq;
import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Service.DomainService;

@RestController
@RequestMapping("/api/domains")
public class DomainController {
    
    private final DomainService domainService;

    DomainController(DomainService domainService) {
        this.domainService = domainService;
    }

    @GetMapping
    public List<Domain> getAllDomains() {
        return domainService.getAllActiveDomains();
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Domain> getEveryDomain() {
        return domainService.getAllDomains();
    }

    @PostMapping("/addDomain")
    public String addDomain(@RequestBody DomainAddReq domainAddReq) {
        return domainService.addDomain(domainAddReq);
    }

    @PostMapping("/admin/addDomain")
    @PreAuthorize("hasRole('ADMIN')")
    public String addAdminDomain(@RequestBody DomainAddReq domainAddReq) {
        return domainService.addAdminDomain(domainAddReq);
    }

    @GetMapping("/getAllInactiveDomains")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Domain> getAllInactiveDomains() {
        return domainService.getAllInactiveDomains();
    }

    @PutMapping("/{domainId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public String approveDomain(@PathVariable Long domainId) {
        return domainService.approveDomain(domainId);
    }

    @PutMapping("/{domainId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public String rejectDomain(@PathVariable Long domainId) {
        return domainService.rejectDomain(domainId);
    }

    @DeleteMapping("/admin/{domainId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteDomain(@PathVariable Long domainId) {
        return domainService.deleteDomain(domainId);
    }
}
