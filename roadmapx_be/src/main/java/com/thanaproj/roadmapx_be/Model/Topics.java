package com.thanaproj.roadmapx_be.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Topics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tId;
    private String tName;
    private String tDesc;
    @ManyToOne
    @JoinColumn(name = "roadmap_id")
    private RoadMap roadMap;
}
