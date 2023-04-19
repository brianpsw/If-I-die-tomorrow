package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
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
	
	@Override
	public CreateBucketResDto updateBucket (MultipartFile photo, UpdateBucketDto updateBucketDto) throws NotFoundException {
		Bucket bucket = bucketRepository.findByBucketId(updateBucketDto.getBucketId());
		if (bucket == null) throw new NotFoundException("존재하지 않는 버킷 ID 입니다.");
		
		try {
			if (!"".equals(bucket.getImageUrl())) s3Upload.fileDelete(bucket.getImageUrl());
			bucket.updateBucket(
					updateBucketDto.getTitle(),
					updateBucketDto.getContent(),
					updateBucketDto.getComplete(),
					updateBucketDto.getHasPhoto() ? s3Upload.uploadFiles(photo, "bucket") : "",
					updateBucketDto.getSecret()
			);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return CreateBucketResDto.toDto(bucketRepository.save(bucket));
	}
	
}
