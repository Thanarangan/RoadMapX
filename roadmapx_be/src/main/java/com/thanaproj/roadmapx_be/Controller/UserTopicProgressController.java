package com.thanaproj.roadmapx_be.Controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.thanaproj.roadmapx_be.Dtos.UserTopicProgressAddReq;
import com.thanaproj.roadmapx_be.Model.UserTopicProgress;
import com.thanaproj.roadmapx_be.Service.UserTopicProgressService;

@RestController
@RequestMapping("/user-topic-progress")
public class UserTopicProgressController {
    
    private final UserTopicProgressService userTopicProgressService;
    public UserTopicProgressController(UserTopicProgressService userTopicProgressService) {
        this.userTopicProgressService = userTopicProgressService;   
    }

    @GetMapping("/{roadMapId}")
    public List<UserTopicProgress> getUserTopicProgressByRoadMapId(@PathVariable Long roadMapId) {
        return userTopicProgressService.getUserTopicProgressRepoByRoadMapId(roadMapId);
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('STUDENT')")
    public String saveUserTopicProgress(@RequestBody UserTopicProgressAddReq userTopicProgress) {
        return userTopicProgressService.saveUserTopicProgress(userTopicProgress);
    }

    @DeleteMapping("/delete/{progressId}")
    @PreAuthorize("hasRole('STUDENT')")
    public String deleteUserTopicProgress(@PathVariable Long progressId) {
        return userTopicProgressService.deleteUserTopicProgress(progressId);
    }
}
