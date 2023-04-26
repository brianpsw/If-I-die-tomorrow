package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommunityServiceImpl implements CommunityService{

	private final BucketRepository bucketRepository;
	private final DiaryRepository diaryRepository;
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	
	@Override
	public GetPageDto getBucketWithComments(Integer pageNo, Integer pageSize){

		pageNo = Optional.ofNullable(pageNo).orElse(0);
		pageSize = Optional.ofNullable(pageSize).orElse(10);
		PageRequest pageable = PageRequest.of(pageNo, pageSize);

//		페이징 객체
		Page<GetBucketResDto> result = bucketRepository.findAllBySecretIsFalse(pageable);

//		dto 리스트로 변환
		List<GetBucketWithCommentDto> data = result
				.stream()
				.map(dto -> GetBucketWithCommentDto.builder()
						.bucket(dto)
						.comments(commentRepository.findCommentsByTypeId(dto.getBucketId(), false))
						.build())
				.collect(Collectors.toList());

		return GetPageDto.builder()
				.data(data)
				.hasNext(result.hasNext())
				.build();
	}

	@Override
	public GetPageDto getDiaryWithComments(Integer pageNo, Integer pageSize){

		pageNo = Optional.ofNullable(pageNo).orElse(0);
		pageSize = Optional.ofNullable(pageSize).orElse(10);
		PageRequest pageable = PageRequest.of(pageNo, pageSize);

//		페이징 객체
		Page<GetDiaryResDto> result = diaryRepository.findAllBySecretIsFalse(pageable);

//		dto 리스트로 변환
		List<GetDiaryWithCommentDto> data = result
				.stream()
				.map(dto -> GetDiaryWithCommentDto.builder()
						.diary(dto)
						.comments(commentRepository.findCommentsByTypeId(dto.getDiaryId(), true))
						.build())
				.collect(Collectors.toList());

		return GetPageDto.builder()
				.data(data)
				.hasNext(result.hasNext())
				.build();

	}

	@Override
	public CreateCommentResDto createComment(CreateCommentReqDto req) {

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

		Comment comment = commentRepository.save(req.toEntity(userId));

		return CreateCommentResDto.builder()
				.commentId(comment.getCommentId())
				.content(comment.getContent())
				.nickname(userRepository.findUserNickNameByUserId(comment.getUserId()))
				.type(comment.getType())
				.typeId(comment.getTypeId())
				.createdAt(comment.getCreatedAt())
				.updatedAt(comment.getUpdatedAt())
				.build();
	}

	@Override
	public Long deleteComment(Long commentId) throws NotFoundException, UnAuthorizedException {

//		댓글
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 아이디입니다."));

//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

//		작성자 일치 여부 검증
		if(!comment.getUserId().equals(userId)) throw new UnAuthorizedException("내가 작성한 댓글이 아닙니다");

		commentRepository.delete(comment);

		return commentId;




	}
}
