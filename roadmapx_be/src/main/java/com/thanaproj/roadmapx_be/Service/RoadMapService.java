package com.thanaproj.roadmapx_be.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanaproj.roadmapx_be.Dtos.RoadMapAddReq;
import com.thanaproj.roadmapx_be.Enum.RoadMapStatus;
import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Model.RoadMap;
import com.thanaproj.roadmapx_be.Repository.DomainRepo;
import com.thanaproj.roadmapx_be.Repository.ResourceRepo;
import com.thanaproj.roadmapx_be.Repository.RoadMapRepo;
import com.thanaproj.roadmapx_be.Repository.TopicRepo;

@Service
public class RoadMapService {

    private final RoadMapRepo roadMapRepo;
    private final DomainRepo domainRepo;
    private final TopicRepo topicRepo;
    private final ResourceRepo resourceRepo;

    public RoadMapService(RoadMapRepo roadMapRepo, DomainRepo domainRepo, TopicRepo topicRepo, ResourceRepo resourceRepo) {
        this.roadMapRepo = roadMapRepo;
        this.domainRepo = domainRepo;
        this.topicRepo = topicRepo;
        this.resourceRepo = resourceRepo;
    }

    public List<RoadMap> getRoadMapsByDomainId(Long domainId) {
        Domain domain = domainRepo.findBydId(domainId);
        return roadMapRepo.findByrStatusAndDomain(RoadMapStatus.ACTIVE, domain);
    }

    public List<RoadMap> getAllRoadMaps() {
        return roadMapRepo.findAll();
    }

    public RoadMap addRoadMapDraft(RoadMapAddReq roadMapAddReq) {
        RoadMap newRoadMap = buildRoadMap(roadMapAddReq);
        newRoadMap.setRStatus(RoadMapStatus.DRAFT);
        return roadMapRepo.save(newRoadMap);
    }

    public List<RoadMap> getDraftRoadMaps() {
        return roadMapRepo.findByrStatus(RoadMapStatus.DRAFT);
    }

    public ResponseEntity<String> addRoadMap(RoadMapAddReq roadMapAddReq) {
        RoadMap newRoadMap = buildRoadMap(roadMapAddReq);
        newRoadMap.setRStatus(RoadMapStatus.PENDING);
        roadMapRepo.save(newRoadMap);
        return ResponseEntity.ok("Roadmap submitted for review successfully");
    }

    public RoadMap updateRoadMap(Long roadMapId, RoadMapAddReq roadMapAddReq) {
        RoadMap roadMap = roadMapRepo.findByrId(roadMapId);
        roadMap.setRName(roadMapAddReq.getRName());
        roadMap.setRDesc(roadMapAddReq.getRDesc());
        Domain domain = domainRepo.findBydId(roadMapAddReq.getDomainId());
        roadMap.setDomain(domain);
        roadMap.setRCreatedBy(roadMapAddReq.getRCreatedBy());
        return roadMapRepo.save(roadMap);
    }

    public ResponseEntity<String> addAdminRoadMap(RoadMapAddReq roadMapAddReq) {
        RoadMap newRoadMap = buildRoadMap(roadMapAddReq);
        newRoadMap.setRStatus(RoadMapStatus.ACTIVE);
        newRoadMap.setRApprovedBy("Admin");
        newRoadMap.setRApprovedAt(LocalDateTime.now());
        roadMapRepo.save(newRoadMap);
        return ResponseEntity.ok("Roadmap created and published successfully");
    }

    public List<RoadMap> getPendingRoadMaps() {
        return roadMapRepo.findByrStatus(RoadMapStatus.PENDING);
    }

    public ResponseEntity<String> submitDraftRoadMap(Long roadMapId) {
        RoadMap roadMap = roadMapRepo.findByrId(roadMapId);
        if (roadMap == null) {
            return ResponseEntity.notFound().build();
        }
        roadMap.setRStatus(RoadMapStatus.PENDING);
        roadMapRepo.save(roadMap);
        return ResponseEntity.ok("Roadmap submitted for review successfully");
    }

    public ResponseEntity<String> approveRoadMap(Long roadMapId) {
        RoadMap roadMap = roadMapRepo.findByrId(roadMapId);
        roadMap.setRStatus(RoadMapStatus.ACTIVE);
        roadMap.setRApprovedBy("Admin");
        roadMap.setRApprovedAt(LocalDateTime.now());
        roadMapRepo.save(roadMap);
        return ResponseEntity.ok("Roadmap approved and published successfully");
    }

    @Transactional
    public ResponseEntity<String> deleteRoadMap(Long roadMapId) {
        RoadMap roadMap = roadMapRepo.findByrId(roadMapId);
        if (roadMap == null) {
            return ResponseEntity.notFound().build();
        }
        topicRepo.findByRoadMap(roadMap).forEach(topic -> {
            resourceRepo.findByTopic(topic).forEach(resourceRepo::delete);
            topicRepo.delete(topic);
        });
        roadMapRepo.delete(roadMap);
        return ResponseEntity.ok("Roadmap deleted successfully");
    }

    private RoadMap buildRoadMap(RoadMapAddReq roadMapAddReq) {
        RoadMap newRoadMap = new RoadMap();
        newRoadMap.setRName(roadMapAddReq.getRName());
        newRoadMap.setRDesc(roadMapAddReq.getRDesc());
        Domain domain = domainRepo.findBydId(roadMapAddReq.getDomainId());
        newRoadMap.setDomain(domain);
        newRoadMap.setRCreatedBy(roadMapAddReq.getRCreatedBy());
        newRoadMap.setRCreatedAt(LocalDateTime.now());
        return newRoadMap;
    }
}
