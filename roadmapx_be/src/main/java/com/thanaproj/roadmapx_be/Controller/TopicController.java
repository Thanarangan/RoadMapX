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
import com.thanaproj.roadmapx_be.Dtos.TopicsAddReq;
import com.thanaproj.roadmapx_be.Model.Topics;
import com.thanaproj.roadmapx_be.Service.TopicService;

@RestController
@RequestMapping("/topics")
public class TopicController {
    
    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping("/roadmap/{roadmapId}")
    public List<Topics> getTopicsByRoadMapId(@PathVariable Long roadmapId) {
        return topicService.getTopicsByRoadMapId(roadmapId);
    }

    @PostMapping("/cm/addTopic")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public Topics addTopic(@RequestBody TopicsAddReq topicReq) {
        return topicService.addTopic(topicReq);
    }

    @PutMapping("/cm/updatetopic/{topicId}")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public String updateTopic(@PathVariable Long topicId, @RequestBody TopicsAddReq topicReq) {
        return topicService.updateTopic(topicId, topicReq);
    }

    @DeleteMapping("/cm/deletetopic/{topicId}")
    @PreAuthorize("hasAnyRole('ADMIN','CONTENT_MANAGER')")
    public String deleteTopic(@PathVariable Long topicId) {
        return topicService.deleteTopic(topicId);
    }


}
