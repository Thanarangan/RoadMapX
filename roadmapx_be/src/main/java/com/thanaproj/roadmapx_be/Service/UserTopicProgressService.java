package com.thanaproj.roadmapx_be.Service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.thanaproj.roadmapx_be.Dtos.UserTopicProgressAddReq;
import com.thanaproj.roadmapx_be.Model.UserTopicProgress;
import com.thanaproj.roadmapx_be.Repository.UserTopicProgressRepo;
import com.thanaproj.roadmapx_be.SecurityConfig.CurrentUser;
import com.thanaproj.roadmapx_be.Service.CustomUserDetails.CustomUserDetails;

@Service
public class UserTopicProgressService {
    
    private final UserTopicProgressRepo userTopicProgressRepo;
    private final CurrentUser currentUser;

    public UserTopicProgressService(UserTopicProgressRepo userTopicProgressRepo, CurrentUser currentUser) {
        this.userTopicProgressRepo = userTopicProgressRepo;
        this.currentUser = currentUser;
    }

    public List<UserTopicProgress> getUserTopicProgressRepoByRoadMapId(Long roadMapId) {
        CustomUserDetails user = currentUser.getCurrentUser();
        if (user == null) {
            return List.of();
        }
        return userTopicProgressRepo.findByUserIdAndRoadMapId(user.getId(), roadMapId);
    }

    public String saveUserTopicProgress(UserTopicProgressAddReq Addreq) {
        CustomUserDetails user = currentUser.getCurrentUser();
        if (user == null) {
            return "User not authenticated";
        }

        UserTopicProgress userTopicProgress = userTopicProgressRepo
            .findByUserIdAndTopicIdAndRoadMapId(user.getId(), Addreq.getTopicId(), Addreq.getRoadMapId())
            .orElseGet(UserTopicProgress::new);

        userTopicProgress.setUserId(user.getId());
        userTopicProgress.setTopicId(Addreq.getTopicId());
        userTopicProgress.setRoadMapId(Addreq.getRoadMapId());
        userTopicProgress.setDomainId(Addreq.getDomainId());
        userTopicProgress.setCompleted(true);
        userTopicProgressRepo.save(userTopicProgress);
        return "topic progress saved successfully";
    }

    public String deleteUserTopicProgress(Long progressId) {
        CustomUserDetails user = currentUser.getCurrentUser();
        if (user == null) {
            return "User not authenticated";
        }

        userTopicProgressRepo.findById(progressId).ifPresent(progress -> {
            if (progress.getUserId().equals(user.getId())) {
                userTopicProgressRepo.delete(progress);
            }
        });
        return "topic progress deleted successfully";
    }
}
