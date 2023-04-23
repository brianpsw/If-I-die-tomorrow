package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfo;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfoFactory;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends DefaultOAuth2UserService implements UserService{

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User user = super.loadUser(userRequest);
        try {
            return this.process(userRequest, user);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    @Override
    public OAuth2User process(OAuth2UserRequest userRequest, OAuth2User user) {
        log.debug("process 메서드가 CustomOAuth2UserService에서 실행됨");
        ProviderType providerType = ProviderType.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase());
        log.debug(user.getAttributes().toString());
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(providerType, user.getAttributes());
        Optional<User> savedUser = userRepository.findByEmail(userInfo.getEmail());

        if (savedUser.isPresent()) {
            updateUser(savedUser.get(), userInfo);
        } else {
            // DB에 저장된 user가 없으면
            createUser(userInfo);
        }

        return user;
    }

    @Override
    public User createUser(OAuth2UserInfo userInfo) {
        log.debug("createUser 메서드가 CustomOAuth2UserService에서 실행됨");
        return userRepository.save(User.builder()
                .age(userInfo.getAge())
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .nickname(generateNickname())
                .build()
        );
    }

    @Override
    public User updateUser(User user, OAuth2UserInfo userInfo) {
        log.debug("updateUser 메서드가 CustomOAuth2UserService에서 실행됨");
        return user;
    }

    @Override
    public String generateNickname() {
        return "빨간 사과";
    }
}
