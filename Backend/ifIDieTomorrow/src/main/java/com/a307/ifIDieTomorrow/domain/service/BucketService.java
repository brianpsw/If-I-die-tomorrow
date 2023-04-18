package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface BucketService {
	CreateBucketResDto createBucket (MultipartFile photo, CreateBucketDto createBucketDto) throws IOException;
}
