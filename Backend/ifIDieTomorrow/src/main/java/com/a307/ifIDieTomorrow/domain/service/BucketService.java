package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public interface BucketService {
	CreateBucketResDto createBucket (CreateBucketDto data, MultipartFile photo) throws IOException, NoPhotoException, IllegalArgumentException;
	
	CreateBucketResDto updateBucket (UpdateBucketDto data, MultipartFile photo) throws IOException, NotFoundException;
	
	Long deleteBucket (Long bucketId) throws NotFoundException;
	
	List<GetBucketByUserResDto> getBucketByUserId () throws NotFoundException;
	
	HashMap<String, Object> getBucketByBucketId (Long bucketId) throws NotFoundException, UnAuthorizedException;
}
