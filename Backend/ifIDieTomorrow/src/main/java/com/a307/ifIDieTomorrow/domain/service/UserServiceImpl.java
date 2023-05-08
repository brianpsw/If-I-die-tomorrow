package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.user.PatchUserAfterDto;
import com.a307.ifIDieTomorrow.domain.dto.user.UserDto;
import com.a307.ifIDieTomorrow.domain.dto.personality.PersonalityReqDto;
import com.a307.ifIDieTomorrow.domain.dto.personality.PersonalityResDto;
import com.a307.ifIDieTomorrow.domain.entity.Personality;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.PersonalityRepository;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfo;
import com.a307.ifIDieTomorrow.global.auth.OAuth2UserInfoFactory;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.config.AdminProperties;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.OAuthProviderMisMatchException;
import com.a307.ifIDieTomorrow.global.util.NicknameGenerator;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl extends DefaultOAuth2UserService implements UserService{

    private final NicknameGenerator nicknameGenerator;
    private final UserRepository userRepository;
    private final WillService willService;
    private final AdminProperties adminProperties;
    private final PersonalityRepository personalityRepository;


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
        List<String> adminList = Arrays.asList(adminProperties.getEmail().split(","));
        if(adminList.contains(principal.getEmail())){
            return UserPrincipal.createAdmin(principal, user.getAttributes());
        }

        return UserPrincipal.create(principal, user.getAttributes());
    }

    @Override
    public User createUser(OAuth2UserInfo userInfo, ProviderType providerType) {
        log.debug("createUser 메서드가 CustomOAuth2UserService에서 실행됨");
        User user = userRepository.save(User.builder()
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

    @Override
    public PersonalityResDto insertPersonality(PersonalityReqDto req) throws NotFoundException {

        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = principal.getUserId();

        User user = userRepository.findById(userId).get();
        Personality personality = personalityRepository.findById(req.getPersonalityId())
                .orElseThrow(() -> new NotFoundException("존재 하지 않는 성향 아이디입니다."));

        user.setPersonality(personality.getPersonalityId());

        return PersonalityResDto.builder()
                .personalityId(personality.getPersonalityId())
                .name(personality.getName())
                .build();

    }
    
    @Override
    public UserDto patchUserAfter (PatchUserAfterDto data, Long userId) throws IllegalArgumentException, NotFoundException {
        if (data.getAgree() && ("".equals(data.getPhone()) || data.getPhone() == null))
            throw new IllegalArgumentException("동의 시 전화번호 입력은 필수입니다.");
        
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFoundException("존재하지 않는 유저입니다."));
        
        user.setSendAgree(data.getAgree());
        user.setPhone(data.getPhone());
        
        return new UserDto(userRepository.save(user));
    }
    
}
