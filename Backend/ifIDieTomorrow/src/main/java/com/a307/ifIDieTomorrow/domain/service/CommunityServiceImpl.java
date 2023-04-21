package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceImpl implements CommunityService{

	private final BucketRepository bucketRepository;
	private final DiaryRepository diaryRepository;
	private final CommentRepository commentRepository;
	
	@Override
	public List<GetBucketWithCommentDto> getBucketWithComments(){

		return bucketRepository.findAllBySecretIsFalse()
				.stream()
				.map(dto -> GetBucketWithCommentDto.builder()
						.bucket(dto)
						.comments(commentRepository.findCommentsByTypeId(dto.getBucketId(), false))
						.build())
				.collect(Collectors.toList());
	}

	@Override
	public List<GetDiaryWithCommentDto> getDiaryWithComments(){

		return diaryRepository.findAllBySecretIsFalse()
				.stream()
				.map(dto -> GetDiaryWithCommentDto.builder()
						.diary(dto)
						.comments(commentRepository.findCommentsByTypeId(dto.getDiaryId(), false))
						.build())
				.collect(Collectors.toList());
	}
}
