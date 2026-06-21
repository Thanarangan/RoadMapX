package com.thanaproj.roadmapx_be.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thanaproj.roadmapx_be.Enum.RoadMapStatus;
import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Model.RoadMap;
import java.util.List;

@Repository
public interface RoadMapRepo extends JpaRepository<RoadMap, Long> {

    List<RoadMap> findByrStatus(RoadMapStatus pending);
    RoadMap findByrId(Long roadMapId);
    List<RoadMap> findByrStatusAndDomain(RoadMapStatus active, Domain domain);
    List<RoadMap> findByDomain(Domain domain);
    
}
