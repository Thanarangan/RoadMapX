package com.thanaproj.roadmapx_be.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.thanaproj.roadmapx_be.Model.Resources;
import com.thanaproj.roadmapx_be.Model.Topics;

import java.util.List;

public interface ResourceRepo extends JpaRepository<Resources, Long>{

    List<Resources> findByTopic(Topics topic);
    
}
