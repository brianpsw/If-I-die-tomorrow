package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryNameDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryThumbnailDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoByCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.UpdatePhotoDto;
import com.a307.ifIDieTomorrow.domain.service.PhotoService;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.FileChecker;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
	
	@PostMapping(value = "/category", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	@Operation(summary = "카테고리 생성", description = "카테고리를 생성합니다.")
	public ResponseEntity<CreateCategoryResDto> createCategory(
			@RequestPart CreateCategoryDto data,
			@RequestPart MultipartFile image) throws UnAuthorizedException, IllegalArgumentException, ImageProcessingException, IOException, MetadataException, NoPhotoException {
		return ResponseEntity.status(HttpStatus.CREATED).body(photoService.createCategory(data, image));
	}
	
	@GetMapping("/category")
	@Operation(summary = "유저의 카테고리 전체 조회", description = "유저의 카테고리를 전체 조회합니다.")
	public ResponseEntity<List<CreateCategoryResDto>> getCategory() {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.getCategory());
	}
	
	@PatchMapping("/category")
	@Operation(summary = "카테고리 이름 변경", description = "카테고리 이름을 변경합니다.")
	public ResponseEntity<CreateCategoryResDto> updateCategoryName(
			@RequestBody UpdateCategoryNameDto data) throws NotFoundException, IllegalArgumentException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.updateCategoryName(data));
	}
	
	@PatchMapping(value = "/category/thumbnail", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
	@Operation(summary = "카테고리 썸네일 변경", description = "카테고리 썸네일을 변경합니다.")
	public ResponseEntity<CreateCategoryResDto> updateCategoryThumbnail(
			@RequestPart UpdateCategoryThumbnailDto data,
			@RequestPart MultipartFile image
			) throws ImageProcessingException, NotFoundException, IOException, NoPhotoException, MetadataException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.updateCategoryThumbnail(data, image));
	}
	
	@DeleteMapping("/category/{categoryId}")
	@Operation(summary = "카테고리 삭제", description = "카테고리를 삭제합니다.")
	public ResponseEntity<Long> deleteCategory(
			@PathVariable Long categoryId) throws NotFoundException, IllegalArgumentException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(photoService.deleteCategory(categoryId));
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
	@PostMapping(value = "", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}) // 메타데이터의 takeAt? 추가 할 것
	@Operation(summary = "포토 클라우드 작성", description = "포토 클라우드를 작성합니다.")
	public ResponseEntity<CreatePhotoResDto> createPhoto(
			@RequestPart CreatePhotoDto data,
			@RequestPart MultipartFile photo) throws IOException, NoPhotoException, IllegalArgumentException, NotFoundException, UnAuthorizedException, ImageProcessingException, MetadataException {
		String mimeType = FileChecker.getMimeType(photo.getInputStream());
		if (!FileChecker.imageCheck(mimeType) && !FileChecker.videoCheck(mimeType)) throw new IllegalArgumentException("허용되지 않은 확장자입니다.");
		return ResponseEntity.status(HttpStatus.CREATED).body(photoService.createPhoto(data, photo));
	}
	
	@PatchMapping("") // 메타데이터의 takeAt? 추가 할 것
	@Operation(summary = "사진 캡션 수정", description = "사진의 캡션을 수정합니다.")
	public ResponseEntity<CreatePhotoResDto> updatePhoto(
			@RequestBody UpdatePhotoDto data) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.updatePhoto(data));
	}
	
	@DeleteMapping("/{photoId}") // 메타데이터의 takeAt? 추가 할 것
	@Operation(summary = "사진 삭제", description = "포토 클라우드의 사진을 삭제합니다.")
	public ResponseEntity<Long> deletePhoto(
			@PathVariable Long photoId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(photoService.deletePhoto(photoId));
	}
	
	@GetMapping("/{categoryId}") // 메타데이터의 takeAt? 추가 할 것
	@Operation(summary = "특정 카테고리의 사진들 조회", description = "카테고리에 속한 사진들을 모두 조회합니다.")
	public ResponseEntity<GetPhotoByCategoryResDto> getPhotoByCategory(
			@PathVariable Long categoryId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.getPhotoByCategory(categoryId));
	}
	
	@GetMapping("") // 메타데이터의 takeAt? 추가 할 것
	@Operation(summary = "유저의 사진 모두 조회", description = "유저의 사진을 모두 조회합니다.")
	public ResponseEntity<List<GetPhotoByCategoryResDto>> getPhotoByUser() {
		return ResponseEntity.status(HttpStatus.OK).body(photoService.getPhotoByUser());
	}
	
}
