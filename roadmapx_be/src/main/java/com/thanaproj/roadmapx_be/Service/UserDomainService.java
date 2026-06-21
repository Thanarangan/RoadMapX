package com.thanaproj.roadmapx_be.Service;

import org.springframework.stereotype.Service;
import com.thanaproj.roadmapx_be.Enum.UserDomainStatus;
import com.thanaproj.roadmapx_be.Model.Domain;
import com.thanaproj.roadmapx_be.Model.UserDomain;
import com.thanaproj.roadmapx_be.Repository.DomainRepo;
import com.thanaproj.roadmapx_be.Repository.UserDomainRepo;
import com.thanaproj.roadmapx_be.SecurityConfig.CurrentUser;
import com.thanaproj.roadmapx_be.Service.CustomUserDetails.CustomUserDetails;

@Service
public class UserDomainService {
    
    private final UserDomainRepo userDomainRepo;
    private final DomainRepo domainRepo;
    private final CurrentUser currentUser;

    UserDomainService(UserDomainRepo userDomainRepo, DomainRepo domainRepo, CurrentUser currentUser) {
        this.userDomainRepo = userDomainRepo;
        this.domainRepo = domainRepo;
        this.currentUser = currentUser;
    }

    public String assignDomainToUser(Long DomainId){
        CustomUserDetails user = currentUser.getCurrentUser();
        if (user == null) {
            return "User not authenticated";
        }
        UserDomain existingdomain = userDomainRepo.findByuIdAndUdStatus(user.getId(), UserDomainStatus.ACTIVE);
        if(existingdomain != null && existingdomain.getDId().equals(DomainId)) {
            return "Already You are there!!!😁";
        }
        if(existingdomain != null) {
            existingdomain.setUdStatus(UserDomainStatus.PAUSED);
            userDomainRepo.save(existingdomain);
        }
        UserDomain userDomain = new UserDomain();
        Domain domain = domainRepo.findBydId(DomainId);
        userDomain.setUId(user.getId());
        userDomain.setUName(user.getUsername());
        userDomain.setDId(DomainId);
        userDomain.setDName(domain.getDName());
        userDomain.setUdStatus(UserDomainStatus.ACTIVE);
        userDomain.setStartDate(java.time.LocalDateTime.now());
        userDomainRepo.save(userDomain);
        return "Domain assigned to user successfully👍 And the Past Domain is Paused ⏸️";
    }

    public Domain getCurrentDomain() {
        CustomUserDetails user = currentUser.getCurrentUser();
        if (user == null) {
            return null;
        }

        UserDomain activeDomain = userDomainRepo.findByuIdAndUdStatus(user.getId(), UserDomainStatus.ACTIVE);
        if (activeDomain == null) {
            return null;
        }

        return domainRepo.findBydId(activeDomain.getDId());
    }

}
