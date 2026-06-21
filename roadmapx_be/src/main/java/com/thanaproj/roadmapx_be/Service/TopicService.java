package com.thanaproj.roadmapx_be.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.thanaproj.roadmapx_be.Dtos.TopicsAddReq;
import com.thanaproj.roadmapx_be.Model.RoadMap;
import com.thanaproj.roadmapx_be.Model.Topics;
import com.thanaproj.roadmapx_be.Repository.RoadMapRepo;
import com.thanaproj.roadmapx_be.Repository.TopicRepo;

@Service
public class TopicService {

    private final TopicRepo topicRepo;
    private final RoadMapRepo roadMapRepo;

    public TopicService(TopicRepo topicRepo, RoadMapRepo roadMapRepo) {
        this.topicRepo = topicRepo;
        this.roadMapRepo = roadMapRepo;
    }

    public Topics addTopic(TopicsAddReq topicReq) {
        Topics topic = new Topics();
        topic.setTName(topicReq.getTName());
        topic.setTDesc(topicReq.getTDesc());
        RoadMap roadmap = roadMapRepo.findByrId(topicReq.getRoadmapId());
        topic.setRoadMap(roadmap);
        return topicRepo.save(topic);
    }

    public List<Topics> getTopicsByRoadMapId(Long roadmapId) {
        RoadMap roadmap = roadMapRepo.findByrId(roadmapId);
        return topicRepo.findByRoadMap(roadmap);
    }

    public String deleteTopic(Long topicId) {
        Topics topic = topicRepo.findBytId(topicId);
        topicRepo.deleteById(topicId);
        return "Topic " + topic.getTName() + " deleted successfully";
    }

    public String updateTopic(Long topicId, TopicsAddReq topicReq) {
        Topics topic = topicRepo.findBytId(topicId);
        topic.setTName(topicReq.getTName());
        topic.setTDesc(topicReq.getTDesc());
        RoadMap roadmap = roadMapRepo.findByrId(topicReq.getRoadmapId());
        topic.setRoadMap(roadmap);
        topicRepo.save(topic);
        return "Topic " + topic.getTName() + " updated successfully";
    }
}
