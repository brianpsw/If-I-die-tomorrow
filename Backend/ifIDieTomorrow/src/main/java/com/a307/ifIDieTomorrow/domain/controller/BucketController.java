package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.domain.service.BucketService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "버킷 리스트", description = "APIs for BUCKET LIST")
@RestController
@RequiredArgsConstructor
@RequestMapping("/bucket")
public class BucketController {
	
	private final BucketService bucketService;
	
	@PostMapping("")
	@Operation(summary = "버킷 리스트 작성", description = "버킷 리스트를 작성합니다.")
	public ResponseEntity<CreateBucketResDto> createBucket(
			@RequestPart(required = false) MultipartFile photo,
			@RequestPart CreateBucketDto createBucketDto) throws IOException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.createBucket(photo, createBucketDto));
	}
	
	@GetMapping("/{userId}")
	@Operation(summary = "유저의 버킷 리스트 전체 조회", description = "유저의 버킷 리스트를 전체 조회합니다.")
	public ResponseEntity<List<GetBucketResDto>> getBucket(
			@PathVariable Long userId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.getBucketByUserId(userId));
	}
	
	@PutMapping("")
	@Operation(summary = "버킷 리스트 수정", description = "버킷 리스트를 수정합니다.")
	public ResponseEntity<CreateBucketResDto> updateBucket(
			@RequestPart(required = false) MultipartFile photo,
			@RequestPart UpdateBucketDto updateBucketDto) throws IOException, NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.updateBucket(photo, updateBucketDto));
	}
	
	@DeleteMapping("/{bucketId}")
	@Operation(summary = "버킷 리스트 삭제", description = "버킷 리스트를 삭제합니다.")
	public ResponseEntity<Long> deleteBucket(
			@PathVariable Long bucketId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.deleteBucket(bucketId));
	}
	
}
