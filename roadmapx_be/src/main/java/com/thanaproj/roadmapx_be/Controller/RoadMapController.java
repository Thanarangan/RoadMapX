package com.thanaproj.roadmapx_be.Controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thanaproj.roadmapx_be.Dtos.RoadMapAddReq;
import com.thanaproj.roadmapx_be.Model.RoadMap;
import com.thanaproj.roadmapx_be.Service.RoadMapService;

@RestController
@RequestMapping("/roadmap")
public class RoadMapController {
    
    private final RoadMapService roadMapService;
    
    RoadMapController(RoadMapService roadMapService) {
        this.roadMapService = roadMapService;
    }

    @GetMapping("/domain/{domainId}")
    public List<RoadMap> getRoadMapsByDomainId(@PathVariable Long domainId) {
        return roadMapService.getRoadMapsByDomainId(domainId);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoadMap> getAllRoadMaps() {
        return roadMapService.getAllRoadMaps();
    }

    @PostMapping("/cm/adddraft")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public RoadMap addRoadMapDraft(@RequestBody RoadMapAddReq roadMapAddReq) {
        return roadMapService.addRoadMapDraft(roadMapAddReq);
    }

    @GetMapping("/cm/draft")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public List<RoadMap> getDraftRoadMaps() {
        return roadMapService.getDraftRoadMaps();
    }

    @PostMapping("/cm/add")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public String addRoadMap(@RequestBody RoadMapAddReq roadMapAddReq) {
        return roadMapService.addRoadMap(roadMapAddReq).getBody();
    }

    @PutMapping("/cm/{roadMapId}")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public RoadMap updateRoadMap(@PathVariable Long roadMapId, @RequestBody RoadMapAddReq roadMapAddReq) {
        return roadMapService.updateRoadMap(roadMapId, roadMapAddReq);
    }

    @PostMapping("/admin/add")
    @PreAuthorize("hasRole('ADMIN')")
    public String addAdminRoadMap(@RequestBody RoadMapAddReq roadMapAddReq) {
        return roadMapService.addAdminRoadMap(roadMapAddReq).getBody();
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RoadMap> getPendingRoadMaps() {
        return roadMapService.getPendingRoadMaps();
    }

    @PutMapping("/admin/{roadMapId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public String approveRoadMap(@PathVariable Long roadMapId) {
        return roadMapService.approveRoadMap(roadMapId).getBody();
    }

    @PutMapping("/cm/{roadMapId}/submit")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public String submitDraftRoadMap(@PathVariable Long roadMapId) {
        return roadMapService.submitDraftRoadMap(roadMapId).getBody();
    }

    @DeleteMapping("/admin/{roadMapId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteRoadMap(@PathVariable Long roadMapId) {
        return roadMapService.deleteRoadMap(roadMapId).getBody();
    }

}
