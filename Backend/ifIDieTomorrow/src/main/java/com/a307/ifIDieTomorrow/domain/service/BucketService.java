package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BucketService {
	CreateBucketResDto createBucket (MultipartFile photo, CreateBucketDto createBucketDto) throws IOException;
	
	CreateBucketResDto updateBucket (MultipartFile photo, UpdateBucketDto createBucketDto) throws IOException, NotFoundException;
	
	Long deleteBucket (Long bucketId) throws NotFoundException;
	
	List<GetBucketByUserResDto> getBucketByUserId (Long userId) throws NotFoundException;
}
