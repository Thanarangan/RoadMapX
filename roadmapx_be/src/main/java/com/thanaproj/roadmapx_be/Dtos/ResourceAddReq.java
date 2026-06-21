package com.thanaproj.roadmapx_be.Dtos;

public class ResourceAddReq {
    private String resName;
    private String resType;
    private String resDesc;
    private String resUrl;
    private Long topicId;
    
    public String getResName() {
        return resName;
    }
    public void setResName(String resName) {
        this.resName = resName;
    }
    public String getResType() {
        return resType;
    }
    public void setResType(String resType) {
        this.resType = resType;
    }
    public String getResDesc() {
        return resDesc;
    }
    public void setResDesc(String resDesc) {
        this.resDesc = resDesc;
    }
    public String getResUrl() {
        return resUrl;
    }
    public void setResUrl(String resUrl) {
        this.resUrl = resUrl;
    }
    public Long getTopicId() {
        return topicId;
    }
    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    

}
