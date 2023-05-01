package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BucketServiceImpl implements BucketService {
	
	private final String BUCKET = "bucket";
	
	private final S3Upload s3Upload;
	
	private final BucketRepository bucketRepository;
	
	private final CommentRepository commentRepository;
	
	@Override
	public CreateBucketResDto createBucket (CreateBucketDto data, MultipartFile photo) throws IOException, NoPhotoException {
//		사진 검증
		if (data.getHasPhoto() && photo == null) throw new NoPhotoException("사진이 업로드 되지 않았습니다.");
		
		Bucket bucket = Bucket.builder().
				userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()).
				title(data.getTitle()).
				content(data.getContent()).
				complete(data.getComplete()).
				imageUrl(data.getHasPhoto() ? s3Upload.upload(photo, BUCKET) : "").
				secret(data.getSecret()).
				build();
		
		return CreateBucketResDto.toDto(bucketRepository.save(bucket));
	}
	
	@Override
	public List<GetBucketByUserResDto> getBucketByUserId () {
		return bucketRepository.findAllByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
	}
	
	@Override
	public HashMap<String, Object> getBucketByBucketId (Long bucketId) throws NotFoundException, UnAuthorizedException {
		Bucket bucket = bucketRepository.findByBucketId(bucketId).orElseThrow(() -> new NotFoundException("잘못된 버킷 리스트 ID 입니다!"));
		if (bucket.getSecret() && bucket.getUserId() != ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
			throw new UnAuthorizedException("해당 버킷에 접근하기 위한 권한이 없습니다.");
		
		return bucketRepository.findByBucketIdWithUserNickName(bucketId)
				.map(dto -> {
//					버킷 리스트의 내용과 댓글을 해쉬맵 형태로 반환합니다.
					HashMap<String, Object> result = new HashMap<>();
					result.put(BUCKET, dto);
					result.put("comments", commentRepository.findCommentsByTypeId(bucketId, true));
					
					return result;
				})
				.orElseThrow(() -> new NotFoundException("잘못된 버킷 리스트 ID 입니다!"));
	}
	
	@Override
	public CreateBucketResDto updateBucket (UpdateBucketDto data, MultipartFile photo) throws NotFoundException {
		Bucket bucket = bucketRepository.findByBucketId(data.getBucketId())
				.orElseThrow(() -> new NotFoundException("존재하지 않는 버킷 ID 입니다."));
		
		try {
			// 사진이 업데이트되었고 기존에 사진이 있었다면 S3에서 사진을 삭제함
			if (data.getUpdatePhoto() && !"".equals(bucket.getImageUrl())) s3Upload.delete(bucket.getImageUrl());
			bucket.updateBucket(
					data.getTitle(),
					data.getContent(),
					data.getComplete(),
					data.getUpdatePhoto() && photo != null ? s3Upload.upload(photo, BUCKET) : "",
					data.getSecret()
			);
		} catch (Exception e) {
			log.error(e.getMessage());
		}
		
		return CreateBucketResDto.toDto(bucketRepository.save(bucket));
	}
	
	@Override
	public Long deleteBucket (Long bucketId) throws NotFoundException {
		Bucket bucket = bucketRepository.findByBucketId(bucketId)
				.orElseThrow(() -> new NotFoundException("존재하지 않는 버킷 ID 입니다."));
		
		// 사진이 있었다면 S3에서 사진을 삭제함
		if (!"".equals(bucket.getImageUrl())) s3Upload.delete(bucket.getImageUrl());

		// 댓글 삭제
		commentRepository.deleteAllInBatch(commentRepository.findAllByTypeIdAndType(bucketId, false));
		
		// 버킷 삭제
		bucketRepository.delete(bucket);
		
		return bucketId;
	}
	
}
