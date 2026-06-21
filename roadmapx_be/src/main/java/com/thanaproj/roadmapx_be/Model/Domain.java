package com.thanaproj.roadmapx_be.Model;

import java.time.LocalDateTime;
import com.thanaproj.roadmapx_be.Enum.DomainStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class Domain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dId;
    private String dName;
    private String dDesc;
    private String dCreatedBy;
    private LocalDateTime dCreatedAt;
    private String dApprovedBy;
    private String dRejectedBy;
    private LocalDateTime dApprovedAt;
    private LocalDateTime dRejectedAt;
    @Enumerated(EnumType.STRING)
    private DomainStatus dStatus;
}
