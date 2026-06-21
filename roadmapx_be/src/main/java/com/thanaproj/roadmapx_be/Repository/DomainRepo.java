package com.thanaproj.roadmapx_be.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thanaproj.roadmapx_be.Enum.DomainStatus;
import com.thanaproj.roadmapx_be.Model.Domain;

@Repository
public  interface DomainRepo extends JpaRepository<Domain, Long> {

    Domain findBydId(Long domainId);

    List<Domain> findBydStatus(DomainStatus inactive);
    
}
