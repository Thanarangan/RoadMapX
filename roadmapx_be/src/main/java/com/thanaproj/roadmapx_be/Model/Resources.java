package com.thanaproj.roadmapx_be.Model;

import com.thanaproj.roadmapx_be.Enum.ResourceType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Data
@Entity
public class Resources {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resId;
    private String resName;
    private String resDesc;
    @ManyToOne
    @JoinColumn(name = "topic_id")
    private Topics topic;
    @Enumerated(EnumType.STRING)
    private ResourceType resType;
    private String resUrl;
}
