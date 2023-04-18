package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.service.BucketService;
//import io.swagger.annotations.Api;
//import io.swagger.annotations.ApiOperation;
//import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bucket")
//@Api(tags = {"버킷 리스트 관리 API"})
public class BucketController {
	
	@Autowired
	private BucketService bucketService;
	
//	@ApiOperation(value = "버킷 리스트 작성", notes = "버킷 리스트를 작성한다.")
	@PostMapping("")
	public ResponseEntity<?> createBucket(
			@RequestBody /*@ApiParam(name = "버킷 정보", required = true)*/ CreateBucketDto createBucketDto) {
		return ResponseEntity.status(HttpStatus.OK).body(bucketService.createBucket(createBucketDto));
	}
	
}
