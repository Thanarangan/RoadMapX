package com.thanaproj.roadmapx_be.Dtos;

public class DomainAddReq {
    private String dName;
    private String dDesc;
    private String dCreatedBy;

    public String getDName() {
        return dName;
    }

    public void setDName(String dName) {
        this.dName = dName;
    }

    public String getDDesc() {
        return dDesc;
    }

    public void setDDesc(String dDesc) {
        this.dDesc = dDesc;
    }

    public String getDCreatedBy() {
        return dCreatedBy;
    }

    public void setDCreatedBy(String dCreatedBy) {
        this.dCreatedBy = dCreatedBy;
    }    
}
