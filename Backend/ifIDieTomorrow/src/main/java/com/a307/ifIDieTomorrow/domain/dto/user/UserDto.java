package com.a307.ifIDieTomorrow.domain.dto.user;

import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long userId;
    private String name;
    private String email;
    private Integer age;
    private String nickname;
    private Boolean sendAgree;
    private String personalPage;
    private Long personalityId;
    private Boolean newCheck;
    private Boolean deleted;
    private ProviderType providerType;

    public UserDto(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.age = user.getAge();
        this.nickname = user.getNickname();
        this.sendAgree = user.getSendAgree();
        this.personalPage = user.getPersonalPage();
        this.personalityId = user.getPersonalityId();
        this.newCheck = user.getNewCheck();
        this.deleted = user.getDeleted();
        this.providerType = user.getProviderType();
    }
}
