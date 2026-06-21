package com.thanaproj.roadmapx_be.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thanaproj.roadmapx_be.Dtos.ResourceAddReq;
import com.thanaproj.roadmapx_be.Model.Resources;
import com.thanaproj.roadmapx_be.Service.ResourceService;

@RestController
@RequestMapping("/resources")
public class ResourceController {
    
    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
    
    @GetMapping("/topic/{topicId}")
    public List<Resources> getResourcesByTopicId(@PathVariable Long topicId) {
        return resourceService.getResourcesByTopicId(topicId);
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public ResponseEntity<String> addResource(@RequestBody ResourceAddReq resourceAddReq) {
        return ResponseEntity.ok(resourceService.addResource(resourceAddReq));
    }

    @DeleteMapping("/delete/{resId}")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public ResponseEntity<String> deleteResource(@PathVariable Long resId) {
        return ResponseEntity.ok(resourceService.deleteResource(resId));
    }

    @PutMapping("/update/{resId}")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public ResponseEntity<String> updateResource(@PathVariable Long resId, @RequestBody ResourceAddReq resourceAddReq) {
        return ResponseEntity.ok(resourceService.updateResource(resId, resourceAddReq));
    }
}
