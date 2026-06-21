package com.thanaproj.roadmapx_be.Dtos;

public class TopicsAddReq {
    private String tName;
    private String tDesc;
    private Long roadmapId;

    public String getTName() {
        return tName;
    }

    public String getTDesc() {
        return tDesc;
    }

    public Long getRoadmapId() {
        return roadmapId;
    }

    public void setTName(String tName) {
        this.tName = tName;
    }

    public void setTDesc(String tDesc) {
        this.tDesc = tDesc;
    }
    
    public void setRoadmapId(Long roadmapId) {
        this.roadmapId = roadmapId;
    }
}
