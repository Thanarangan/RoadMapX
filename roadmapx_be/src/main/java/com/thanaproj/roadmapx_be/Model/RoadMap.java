package com.thanaproj.roadmapx_be.Model;

import java.time.LocalDateTime;
import com.thanaproj.roadmapx_be.Enum.RoadMapStatus;
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
public class RoadMap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rId;
    private String rName;
    private String rDesc;
    @ManyToOne
    @JoinColumn(name = "domain_id")
    private Domain domain;
    private String rCreatedBy;
    private LocalDateTime rCreatedAt;
    private String rApprovedBy;
    private LocalDateTime rApprovedAt;
    private String rRejectedBy;
    private LocalDateTime rRejectedAt;
    @Enumerated(EnumType.STRING)
    private RoadMapStatus rStatus;
}
