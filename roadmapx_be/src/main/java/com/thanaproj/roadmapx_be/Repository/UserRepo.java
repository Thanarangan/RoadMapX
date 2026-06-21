package com.thanaproj.roadmapx_be.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.thanaproj.roadmapx_be.Model.User;

public interface UserRepo extends JpaRepository<User, Long> {
    boolean existsByuemail(String email);

    User findByuemail(String email);
}
