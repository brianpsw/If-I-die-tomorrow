package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.domain.service.PhotoService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "포토 클라우드와 카테고리", description = "APIs for PHOTO CLOUD and CATEGORY")
@RestController
@RequiredArgsConstructor
@RequestMapping("/photo")
public class PhotoController {
	
	private final PhotoService photoService;
	
	///////////////////////
	// APIs For CATEGORY //
	///////////////////////
	
	@PostMapping("/category")
	@Operation(summary = "카테고리 생성", description = "카테고리를 생성합니다.")
	public ResponseEntity<CreateCategoryResDto> createCategory(
			@RequestBody CreateCategoryDto data) {
		return ResponseEntity.status(HttpStatus.CREATED).body(photoService.createCategory(data));
	}
	
	@GetMapping("/category/{userId}")
	@Operation(summary = "유저의 카테고리 전체 조회", description = "유저의 카테고리를 전체 조회합니다.")
	public ResponseEntity<List<CreateCategoryResDto>> createCategory(
			@PathVariable Long userId) {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.getCategory(userId));
	}
	
	@PatchMapping("/category")
	@Operation(summary = "카테고리 이름 변경", description = "카테고리 이름을 변경합니다.")
	public ResponseEntity<CreateCategoryResDto> updateCategory(
			@RequestBody UpdateCategoryDto data) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.updateCategory(data));
	}
	
	@DeleteMapping("/category/{categoryId}")
	@Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다.")
	public ResponseEntity<Long> deleteCategory(
			@PathVariable Long categoryId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(photoService.deleteCategory(categoryId));
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
}
