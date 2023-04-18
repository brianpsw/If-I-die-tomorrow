package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class BucketServiceImpl implements BucketService {
	
	private final S3Upload s3Upload;
	
	private final BucketRepository bucketRepository;
	
	@Override
	public CreateBucketResDto createBucket (MultipartFile photo, CreateBucketDto createBucketDto) throws IOException {
		Bucket bucket = Bucket.builder().
				userId(createBucketDto.getUserId()).
				title(createBucketDto.getTitle()).
				content(createBucketDto.getContent()).
				complete(createBucketDto.getComplete()).
				imageUrl(createBucketDto.getHasPhoto() ? s3Upload.uploadFiles(photo, "bucket") : "").
				secret(createBucketDto.getSecret()).build();
		
		return CreateBucketResDto.toDto(bucketRepository.save(bucket));
	}
	
}
