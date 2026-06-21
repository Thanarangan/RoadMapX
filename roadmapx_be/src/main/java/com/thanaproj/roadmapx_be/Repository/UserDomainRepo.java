package com.thanaproj.roadmapx_be.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.thanaproj.roadmapx_be.Enum.UserDomainStatus;
import com.thanaproj.roadmapx_be.Model.UserDomain;

@Repository
public interface UserDomainRepo extends JpaRepository<UserDomain, Long> {
    UserDomain findByuIdAndUdStatus(Long id, UserDomainStatus active);
}
