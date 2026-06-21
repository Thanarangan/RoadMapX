package com.thanaproj.roadmapx_be.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanaproj.roadmapx_be.Model.UserTopicProgress;

@Repository
public interface UserTopicProgressRepo extends JpaRepository<UserTopicProgress, Long> {

    List<UserTopicProgress> findByRoadMapId(Long roadMapId);

    List<UserTopicProgress> findByUserIdAndRoadMapId(Long userId, Long roadMapId);

    Optional<UserTopicProgress> findByUserIdAndTopicIdAndRoadMapId(Long userId, Long topicId, Long roadMapId);
    
}
