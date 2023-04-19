package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.domain.service.BucketService;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiParam;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/bucket")
public class BucketController {
	
	private final BucketService bucketService;
	
	@PostMapping("")
	public ResponseEntity<?> createBucket(
			@RequestBody MultipartFile photo,
			@RequestBody CreateBucketDto createBucketDto) throws IOException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.createBucket(photo, createBucketDto));
	}
	
	@PutMapping("")
	public ResponseEntity<?> updateBucket(
			@RequestBody MultipartFile photo,
			@RequestBody UpdateBucketDto updateBucketDto) throws IOException, NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.updateBucket(photo, updateBucketDto));
	}
	
}
