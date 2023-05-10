package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.personality.PersonalityReqDto;
import com.a307.ifIDieTomorrow.domain.dto.personality.PersonalityResDto;
import com.a307.ifIDieTomorrow.domain.dto.user.PatchUserAfterDto;
import com.a307.ifIDieTomorrow.domain.dto.user.UserDto;
import com.a307.ifIDieTomorrow.domain.service.UserService;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.opencsv.exceptions.CsvException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@Tag(name = "유저", description = "APIs for User")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping()
    @Operation(summary = "유저 자신의 정보 조회", description = "유저 자신의 정보를 조회합니다.")
    public ResponseEntity<UserDto> getUser() throws NotFoundException {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUser(principal.getUserId()));
    }
    
    @GetMapping("/nickname")
    @Operation(summary = "랜덤 닉네임 얻기", description = "랜덤 닉네임 생성하기")
    public ResponseEntity<String> getNickname() throws IOException, CsvException {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getNickname());
    }
    
    @PatchMapping("/nickname")
    @Operation(summary = "유저의 닉네임 변경", description = "유저의 닉네임 변경합니다.")
    public ResponseEntity<UserDto> patchNickname(@RequestBody Map<String, String> nicknameMap) throws NotFoundException {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(userService.changeNickname(nicknameMap.get("nickname"), principal.getUserId()));
    }

    @PatchMapping("/after")
    @Operation(summary = "사후 전송 서비스 동의 여부 수정", description = "사후 전송 서비스 동의 여부를 수정합니다.")
    public ResponseEntity<UserDto> patchUserAfter(@RequestBody PatchUserAfterDto data) throws NotFoundException, IllegalArgumentException {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.status(HttpStatus.OK).body(userService.patchUserAfter(data, principal.getUserId()));
    }

    @PatchMapping("/personality")
    @Operation(summary = "유저의 성향 입력", description = "유저의 성향을 입력합니다.")
    public ResponseEntity<PersonalityResDto> insertPersonality(@RequestBody PersonalityReqDto req) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(userService.insertPersonality(req));
    }

}
