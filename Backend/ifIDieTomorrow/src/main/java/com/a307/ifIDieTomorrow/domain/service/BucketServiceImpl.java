package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BucketServiceImpl implements BucketService {
	
	private final BucketRepository bucketRepository;
	
	@Override
	public CreateBucketResDto createBucket (CreateBucketDto createBucketDto) {
		Bucket bucket = Bucket.builder().
				userId(createBucketDto.getUserId()).
				title(createBucketDto.getTitle()).
				content(createBucketDto.getContent()).
				complete(createBucketDto.getComplete()).
				imageUrl(createBucketDto.getImageUrl()).
				secret(createBucketDto.getSecret()).build();
		
		return CreateBucketResDto.toDto(bucketRepository.save(bucket));
	}
	
}
