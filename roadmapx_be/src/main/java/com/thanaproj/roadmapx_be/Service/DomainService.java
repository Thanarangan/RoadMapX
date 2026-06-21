package com.thanaproj.roadmapx_be.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thanaproj.roadmapx_be.Dtos.DomainAddReq;
import com.thanaproj.roadmapx_be.Enum.DomainStatus;
import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Repository.DomainRepo;
import com.thanaproj.roadmapx_be.Repository.ResourceRepo;
import com.thanaproj.roadmapx_be.Repository.RoadMapRepo;
import com.thanaproj.roadmapx_be.Repository.TopicRepo;

@Service
public class DomainService {

    private final DomainRepo domainRepo;
    private final RoadMapRepo roadMapRepo;
    private final TopicRepo topicRepo;
    private final ResourceRepo resourceRepo;

    DomainService(DomainRepo domainRepo, RoadMapRepo roadMapRepo, TopicRepo topicRepo, ResourceRepo resourceRepo) {
        this.domainRepo = domainRepo;
        this.roadMapRepo = roadMapRepo;
        this.topicRepo = topicRepo;
        this.resourceRepo = resourceRepo;
    }

    public List<Domain> getAllActiveDomains() {
        return domainRepo.findBydStatus(DomainStatus.ACTIVE);
    }

    public List<Domain> getAllDomains() {
        return domainRepo.findAll();
    }

    public String addDomain(DomainAddReq domainAddReq) {
        Domain domain = buildDomain(domainAddReq);
        domain.setDStatus(DomainStatus.INACTIVE);
        domainRepo.save(domain);
        return "Domain added and waiting for approval";
    }

    public String addAdminDomain(DomainAddReq domainAddReq) {
        Domain domain = buildDomain(domainAddReq);
        domain.setDStatus(DomainStatus.ACTIVE);
        domain.setDApprovedBy("Admin");
        domain.setDApprovedAt(LocalDateTime.now());
        domainRepo.save(domain);
        return "Domain created and published successfully";
    }

    public List<Domain> getAllInactiveDomains() {
        return domainRepo.findBydStatus(DomainStatus.INACTIVE);
    }

    public String approveDomain(Long domainId) {
        Domain domain = domainRepo.findBydId(domainId);
        domain.setDStatus(DomainStatus.ACTIVE);
        domain.setDApprovedBy("Admin");
        domain.setDApprovedAt(LocalDateTime.now());
        domainRepo.save(domain);
        return "Domain is approved and published";
    }

    public String rejectDomain(Long domainId) {
        Domain domain = domainRepo.findBydId(domainId);
        domain.setDStatus(DomainStatus.REJECTED);
        domain.setDRejectedAt(LocalDateTime.now());
        domain.setDRejectedBy("Admin");
        domainRepo.save(domain);
        return "Domain is rejected and not published";
    }

    @Transactional
    public String deleteDomain(Long domainId) {
        Domain domain = domainRepo.findBydId(domainId);
        roadMapRepo.findByDomain(domain).forEach(roadMap -> {
            topicRepo.findByRoadMap(roadMap).forEach(topic -> {
                resourceRepo.findByTopic(topic).forEach(resourceRepo::delete);
                topicRepo.delete(topic);
            });
            roadMapRepo.delete(roadMap);
        });
        domainRepo.delete(domain);
        return "Domain deleted successfully";
    }

    private Domain buildDomain(DomainAddReq domainAddReq) {
        Domain domain = new Domain();
        domain.setDName(domainAddReq.getDName());
        domain.setDDesc(domainAddReq.getDDesc());
        domain.setDCreatedBy(domainAddReq.getDCreatedBy());
        domain.setDCreatedAt(LocalDateTime.now());
        return domain;
    }
}
