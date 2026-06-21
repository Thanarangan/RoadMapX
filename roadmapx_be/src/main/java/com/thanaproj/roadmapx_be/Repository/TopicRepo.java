package com.thanaproj.roadmapx_be.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thanaproj.roadmapx_be.Model.RoadMap;
import com.thanaproj.roadmapx_be.Model.Topics;

public interface TopicRepo extends JpaRepository<Topics, Long> {
    List<Topics> findByRoadMap(RoadMap roadmap);
    Topics findBytId(Long topicId);
    
}
