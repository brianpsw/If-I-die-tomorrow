package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.service.WillService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "유언", description = "APIs for WILL")
@RestController
@RequiredArgsConstructor
@RequestMapping("/will")
public class WillController {
	
	private final WillService willService;
	
	@GetMapping("/{userId}")
	@Operation(summary = "유저의 유언 조회", description = "유저의 유언을 조회합니다.")
	public ResponseEntity<GetWillByUserResDto> getWill(
			@PathVariable Long userId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(willService.getWillByUserId(userId));
	}
	
	
}
