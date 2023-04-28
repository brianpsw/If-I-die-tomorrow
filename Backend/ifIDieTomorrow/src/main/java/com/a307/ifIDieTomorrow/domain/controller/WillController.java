package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.service.WillService;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "유언", description = "APIs for WILL")
@RestController
@RequiredArgsConstructor
@RequestMapping("/will")
public class WillController {
	
	private final WillService willService;
	
	@GetMapping("")
	@Operation(summary = "유언 조회", description = "유저의 유언을 조회합니다.")
	public ResponseEntity<GetWillByUserResDto> getWill() throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(willService.getWillByUserId());
	}
	
	@PatchMapping("/sign")
	@Operation(summary = "서명 저장", description = "유저의 서명을 저장합니다.")
	public ResponseEntity<Long> createSign(
			@RequestPart MultipartFile photo) throws NoPhotoException, IOException, IllegalArgumentException {
		return ResponseEntity.status(HttpStatus.OK).body(willService.createSign(photo));
	}
	
	@PatchMapping("/text")
	@Operation(summary = "유언장 텍스트 수정", description = "유저의 텍스트를 수정합니다.")
	public ResponseEntity<Long> updateContent(
			@RequestBody String content) {
		return ResponseEntity.status(HttpStatus.OK).body(willService.updateContent(content));
	}
	
	@PatchMapping("/video")
	@Operation(summary = "유언장 영상 수정", description = "유저의 영상을 수정합니다.")
	public ResponseEntity<Long> updateVideo(
			@RequestPart MultipartFile video) throws IOException, IllegalArgumentException, NoPhotoException {
		return ResponseEntity.status(HttpStatus.OK).body(willService.updateVideo(video));
	}
	
}
