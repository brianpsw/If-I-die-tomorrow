package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.token.RegisterTokenDto;
import com.a307.ifIDieTomorrow.domain.service.TokenService;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "토큰", description = "APIs for Token")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/token")
public class TokenController {

	private final TokenService tokenService;
	
	@PostMapping("")
	@Operation(summary = "토큰 추가", description = "Push 알림을 받을 수 있도록 등록토큰을 추가합니다.")
	public ResponseEntity<String> registerToken(@RequestBody RegisterTokenDto data) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.CREATED).body(tokenService.registerToken(data));
	}

}
