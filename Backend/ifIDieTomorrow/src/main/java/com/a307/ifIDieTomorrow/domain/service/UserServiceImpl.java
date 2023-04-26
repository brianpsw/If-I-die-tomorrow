package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.UserDto;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfo;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfoFactory;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.OAuthProviderMisMatchException;
import com.a307.ifIDieTomorrow.global.util.NicknameGenerator;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends DefaultOAuth2UserService implements UserService{

    private final NicknameGenerator nicknameGenerator;
    private final UserRepository userRepository;
    private final WillService willService;


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
        User principal = new User();
        if (savedUser.isPresent()) {
            User existedUser = savedUser.get();
            if (providerType != existedUser.getProviderType()) {
                throw new OAuthProviderMisMatchException(
                        "Looks like you're signed up with " + providerType +
                                " account. Please use your " + existedUser.getProviderType() + " account to login."
                );
            }
            principal = updateUser(savedUser.get(), userInfo);
        } else {
            // DB에 저장된 user가 없으면
            principal = createUser(userInfo, providerType);
        }

        return UserPrincipal.create(principal, user.getAttributes());
    }

    @Override
    public User createUser(OAuth2UserInfo userInfo, ProviderType providerType) {
        log.debug("createUser 메서드가 CustomOAuth2UserService에서 실행됨");
        User user = userRepository.save(User.builder()
                .age(userInfo.getAge())
                .email(userInfo.getEmail())
                .name(userInfo.getName())
                .nickname(generateNickname())
                .providerType(providerType)
                .build());
        willService.createWill(user.getUserId());
        return user;
    }

    @Override
    public User updateUser(User user, OAuth2UserInfo userInfo) {
        log.debug("updateUser 메서드가 CustomOAuth2UserService에서 실행됨");
        if(userInfo.getAge() != null && !userInfo.getAge().equals(user.getAge())){user.setAge(userInfo.getAge());}
        if(userInfo.getName() != null && !userInfo.getName().equals(user.getName())){user.setName(userInfo.getName());}
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public String generateNickname() {
        return "빨간 사과";
    }

    @Override
    public UserDto getUser(Long userId) throws NotFoundException {
        return userRepository.findById(userId).map(UserDto::new).orElseThrow(() -> new NotFoundException("존재하지 않는 User ID 입니다."));
    }

    @Override
    public String getNickname() throws IOException, CsvException {
        return nicknameGenerator.getRandomItemFromCsv();
    }

    @Override
    public UserDto changeNickname(String nickname, Long userId) throws NotFoundException {
        Optional<User> temp = userRepository.findById(userId);
        User user = temp.orElseThrow(() -> new NotFoundException("존재하지 않는 유저 ID입니다."));
        user.setNickname(nickname + "#" + userId);
        user.setNewCheck(false);
        return new UserDto(userRepository.save(user));
    }
}
