package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.CreateBucketResDto;

public interface BucketService {
	CreateBucketResDto createBucket (CreateBucketDto createBucketDto);
}
