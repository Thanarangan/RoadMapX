package com.thanaproj.roadmapx_be.Dtos;

public class UserTopicProgressAddReq {
    private Long userId;
    private Long topicId;
    private Long roadMapId;
    private Long domainId;
    private boolean isCompleted;
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getTopicId() {
        return topicId;
    }
    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }
    public Long getRoadMapId() {
        return roadMapId;
    }
    public void setRoadMapId(Long roadMapId) {
        this.roadMapId = roadMapId;
    }
    public Long getDomainId() {
        return domainId;
    }
    public void setDomainId(Long domainId) {
        this.domainId = domainId;
    }
    public boolean isCompleted() {
        return isCompleted;
    }
    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    
}
