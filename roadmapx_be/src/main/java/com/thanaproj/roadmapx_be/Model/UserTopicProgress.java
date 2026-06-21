package com.thanaproj.roadmapx_be.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class UserTopicProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long progressId;
    private Long userId;
    private Long topicId;
    private Long roadMapId;
    private Long domainId;
    private boolean isCompleted;
}
