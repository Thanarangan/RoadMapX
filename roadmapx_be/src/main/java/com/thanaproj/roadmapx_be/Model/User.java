package com.thanaproj.roadmapx_be.Model;

import com.thanaproj.roadmapx_be.Enum.Role;
import com.thanaproj.roadmapx_be.Enum.CMStatus;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long uid;
    private String uname;
    private String uemail;
    private String upassword;
    @Enumerated(EnumType.STRING)
    private Role urole;
    @Enumerated(EnumType.STRING)
    private CMStatus ustatus;
}
