package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.*;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public interface BucketService {
	CreateBucketResDto createBucket (CreateBucketDto data, MultipartFile photo) throws IOException, NoPhotoException, ImageProcessingException, MetadataException;
	
	CreateBucketResDto updateBucket (UpdateBucketDto data, MultipartFile photo) throws IOException, NotFoundException;
	
	Long deleteBucket (Long bucketId) throws NotFoundException, UnAuthorizedException;
	
	List<GetBucketByUserResDto> getBucketByUserId () throws NotFoundException;
	
	HashMap<String, Object> getBucketByBucketId (Long bucketId) throws NotFoundException, UnAuthorizedException;
	
	CreateBucketResDto createBucketWithTitle (String title);
	
	CreateBucketResDto updateBucketTitle (UpdateBucketTitleDto data) throws NotFoundException, UnAuthorizedException;
}
