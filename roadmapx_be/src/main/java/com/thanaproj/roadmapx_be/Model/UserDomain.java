package com.thanaproj.roadmapx_be.Model;

import java.time.LocalDateTime;

import com.thanaproj.roadmapx_be.Enum.UserDomainStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Data
@Entity
public class UserDomain {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long udId;
    private Long uId;
    private String uName;
    private Long dId;
    private String dName;
    @Enumerated(EnumType.STRING)
    private UserDomainStatus udStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}
