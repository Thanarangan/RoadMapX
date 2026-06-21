package com.thanaproj.roadmapx_be.Dtos;

public class RoadMapAddReq {
    private String rName;
    private String rDesc;
    private Long domainId;
    private String rCreatedBy;

    public String getRName() {
        return rName;
    }

    public void setRName(String rName) {
        this.rName = rName;
    }

    public String getRDesc() {
        return rDesc;
    }

    public void setRDesc(String rDesc) {
        this.rDesc = rDesc;
    }

    public Long getDomainId() {
        return domainId;
    }

    public void setDomainId(Long domainId) {
        this.domainId = domainId;
    }

    public String getRCreatedBy() {
        return rCreatedBy;
    }

    public void setRCreatedBy(String rCreatedBy) {
        this.rCreatedBy = rCreatedBy;
    }
    
}
