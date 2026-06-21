package com.thanaproj.roadmapx_be.Service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.thanaproj.roadmapx_be.Dtos.ResourceAddReq;
import com.thanaproj.roadmapx_be.Enum.ResourceType;
import com.thanaproj.roadmapx_be.Model.Resources;
import com.thanaproj.roadmapx_be.Model.Topics;
import com.thanaproj.roadmapx_be.Repository.ResourceRepo;
import com.thanaproj.roadmapx_be.Repository.TopicRepo;

@Service
public class ResourceService {
    
    private final ResourceRepo resourceRepo;
    private final TopicRepo topicRepo;
    
    public ResourceService(ResourceRepo resourceRepo, TopicRepo topicRepo) {
        this.resourceRepo = resourceRepo;
        this.topicRepo = topicRepo;
    }

    public List<Resources> getResourcesByTopicId(Long topicId) {
        Topics topic = topicRepo.findBytId(topicId);
        return resourceRepo.findByTopic(topic);
    }

    public String addResource(ResourceAddReq resourceAddReq) {
        Resources resource = new Resources();
        resource.setResName(resourceAddReq.getResName());
        resource.setResType(ResourceType.valueOf(resourceAddReq.getResType()));
        resource.setResDesc(resourceAddReq.getResDesc());
        resource.setResUrl(resourceAddReq.getResUrl());
        Topics topic = topicRepo.findBytId(resourceAddReq.getTopicId());
        resource.setTopic(topic);
        resourceRepo.save(resource);
        return "Resource added successfully to the " + topic.getTName() + " topic 🙌";
    }

    public String deleteResource(Long resId) {
        resourceRepo.deleteById(resId);
        return "Resource deleted successfully 🙌";
    }

    public String updateResource(Long resId, ResourceAddReq resourceAddReq) {
        Resources resource = resourceRepo.findById(resId).orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setResName(resourceAddReq.getResName());
        resource.setResType(ResourceType.valueOf(resourceAddReq.getResType()));
        resource.setResDesc(resourceAddReq.getResDesc());
        resource.setResUrl(resourceAddReq.getResUrl());
        Topics topic = topicRepo.findBytId(resourceAddReq.getTopicId());
        resource.setTopic(topic);
        resourceRepo.save(resource);
        return "Resource updated successfully to the " + topic.getTName() + " topic 🙌";
    }
}
