package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.bucket.*;
import com.a307.ifIDieTomorrow.domain.service.BucketService;
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
import java.util.HashMap;
import java.util.List;

@Tag(name = "버킷 리스트", description = "APIs for BUCKET LIST")
@RestController
@RequiredArgsConstructor
@RequestMapping("/bucket")
public class BucketController {

	private final BucketService bucketService;
	
	@PostMapping("/title")
	@Operation(summary = "버킷 리스트 생성", description = "제목만 있는 버킷 리스트를 생성합니다.")
	public ResponseEntity<CreateBucketResDto> createBucketWithTitle(
			@RequestBody CreateBucketWithTitleDto data) {
		return ResponseEntity.status(HttpStatus.CREATED).body(bucketService.createBucketWithTitle(data));
	}
	
	@PostMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	@Operation(summary = "버킷 리스트 작성", description = "버킷 리스트를 작성합니다.")
	public ResponseEntity<CreateBucketResDto> createBucket(
			@RequestPart CreateBucketDto data,
			@RequestPart(required = false) MultipartFile photo) throws IOException, NoPhotoException, ImageProcessingException, MetadataException, IllegalArgumentException {
		if (photo != null && !FileChecker.imageCheck(photo.getInputStream())) throw new IllegalArgumentException("허용되지 않은 확장자입니다.");
		return ResponseEntity.status(HttpStatus.CREATED).body(bucketService.createBucket(data, photo));
	}

	@GetMapping("")
	@Operation(summary = "유저의 버킷 리스트 전체 조회", description = "유저의 버킷 리스트를 전체 조회합니다.")
	public ResponseEntity<List<GetBucketByUserResDto>> getBucket() throws NotFoundException {

		return ResponseEntity.status(HttpStatus.OK).body(bucketService.getBucketByUserId());
	}

	@GetMapping("/{bucketId}")
	@Operation(summary = "유저의 버킷 리스트 1개 조회", description = "유저의 버킷 리스트를 1개 조회합니다.")
	public ResponseEntity<HashMap<String, Object>> getBucketDetail(
			@PathVariable Long bucketId) throws NotFoundException, UnAuthorizedException {

		return ResponseEntity.status(HttpStatus.OK).body(bucketService.getBucketByBucketId(bucketId));
	}
	
	@PutMapping(value = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	@Operation(summary = "버킷 리스트 수정", description = "버킷 리스트를 수정합니다.")
	public ResponseEntity<CreateBucketResDto> updateBucket(
			@RequestPart UpdateBucketDto data,
			@RequestPart(required = false) MultipartFile photo) throws IOException, NotFoundException, ImageProcessingException, UnAuthorizedException, MetadataException, IllegalArgumentException {
		if (photo != null && !FileChecker.imageCheck(photo.getInputStream())) throw new IllegalArgumentException("허용되지 않은 확장자입니다.");
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.updateBucket(data, photo));
	}
	
	@PatchMapping("")
	@Operation(summary = "버킷 제목 수정", description = "버킷 리스트를 수정합니다.")
	public ResponseEntity<CreateBucketResDto> updateBucket(
			@RequestBody UpdateBucketTitleDto data) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.updateBucketTitle(data));
	}

	@DeleteMapping("/{bucketId}")
	@Operation(summary = "버킷 리스트 삭제", description = "버킷 리스트를 삭제합니다.")
	public ResponseEntity<Long> deleteBucket(
			@PathVariable Long bucketId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(bucketService.deleteBucket(bucketId));
	}

}
