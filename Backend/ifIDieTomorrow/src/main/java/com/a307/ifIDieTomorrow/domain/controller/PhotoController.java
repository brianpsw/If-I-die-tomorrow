package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.service.PhotoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "포토 클라우드", description = "APIs for PHOTO CLOUD")
@RestController
@RequiredArgsConstructor
@RequestMapping("/photo")
public class PhotoController {
	
	private final PhotoService photoService;
	
	///////////////////////
	// APIs For CATEGORY //
	///////////////////////
	
	@PostMapping("/category")
	@Operation(summary = "버킷 리스트 작성", description = "버킷 리스트를 작성합니다.")
	public ResponseEntity<CreateCategoryResDto> createCategory(
			@RequestBody CreateCategoryDto data) {
		return ResponseEntity.status(HttpStatus.CREATED).body(photoService.createCategory(data));
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
}
