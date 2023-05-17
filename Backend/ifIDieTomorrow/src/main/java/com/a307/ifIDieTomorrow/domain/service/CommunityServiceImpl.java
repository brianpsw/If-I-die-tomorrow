package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.UpdateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.*;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.*;
import com.a307.ifIDieTomorrow.domain.repository.*;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.BadRequestException;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.AdminUtil;
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
	private final ReportRepository reportRepository;
	private final AdminUtil adminUtil;

	@Override
	public GetPageDto getBucketWithComments(Integer pageNo, Integer pageSize){

		pageNo = Optional.ofNullable(pageNo).orElse(0);
		pageSize = Optional.ofNullable(pageSize).orElse(10);
		PageRequest pageable = PageRequest.of(pageNo, pageSize);

//		페이징 객체
		Page<GetBucketResDto> result = bucketRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);

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
		Page<GetDiaryResDto> result = diaryRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);

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
	public CreateCommentResDto createComment(CreateCommentReqDto req) throws NotFoundException, IllegalArgumentException {

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

		// 존재하지 않는 게시글에 댓글 작성
		boolean isExisting = req.getType() ? diaryRepository.existsById(req.getTypeId()) : bucketRepository.existsById(req.getTypeId());
		if (!isExisting) throw new NotFoundException("존재하지 않는 게시글입니다.");

		if ("".equals(req.getContent().trim())) throw new IllegalArgumentException("내용이 없습니다.");


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
				.orElseThrow(() -> new NotFoundException("잘못된 댓글 아이디입니다."));

//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

//		작성자 일치 여부 검증
		if(!comment.getUserId().equals(userId)) throw new UnAuthorizedException("내가 작성한 댓글이 아닙니다.");

		commentRepository.delete(comment);

		return commentId;
	}

	@Override
	public CreateCommentResDto updateComment(UpdateCommentReqDto req) throws NotFoundException, UnAuthorizedException, IllegalArgumentException {

		//		댓글
		Comment comment = commentRepository.findById(req.getCommentId())
				.orElseThrow(() -> new NotFoundException("잘못된 댓글 아이디입니다."));
		
		if ("".equals(req.getContent().trim())) throw new IllegalArgumentException("내용이 없습니다.");

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

//		해당하는 유저가 항상 존재함이 보증된다.
		User user = userRepository.findById(userId).get();



//		작성자 일치 여부 검증
		if (!comment.getUserId().equals(userId)) throw new UnAuthorizedException("내가 작성한 댓글이 아닙니다");

		comment.updateComment(req.getContent());
		Comment updatedComment = commentRepository.save(comment);


		return CreateCommentResDto.builder()
				.commentId(updatedComment.getCommentId())
				.content(updatedComment.getContent())
				.nickname(user.getNickname())
				.type(updatedComment.getType())
				.typeId(updatedComment.getTypeId())
				.createdAt(updatedComment.getCreatedAt())
				.updatedAt(updatedComment.getUpdatedAt())
				.build();
	}

	@Override
	public ReportResDto createReport(ReportReqDto req) throws NotFoundException, BadRequestException {

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

//		중복 신고 예외처리
		if (reportRepository.existsByUserIdAndTypeAndTypeId(userId, req.getType(), req.getTypeId())) throw new BadRequestException("이미 신고한 게시글입니다");

//		신고 저장
		Report report = reportRepository.save(
				Report.builder()
						.userId(userId)
						.type(req.getType())
						.typeId(req.getTypeId())
						.content(req.getContent())
						.build()
		);

		Integer reportCount;

//		신고 처리: 다이어리
		if (req.getType()) {
//			잘못된 아이디 예외처리
			Diary diary = diaryRepository.findById(req.getTypeId())
					.orElseThrow(() -> new NotFoundException("잘못된 다이어리 아이디입니다."));

//			신고 횟수 누적
			diary.reportDiary();

//			다이어리 저장
			reportCount = diaryRepository.save(diary).getReport();

		}

//		신고처리: 버킷 (로직은 동일)
		else {
			Bucket bucket = bucketRepository.findByBucketId(req.getTypeId())
					.orElseThrow(() -> new NotFoundException("잘못된 버킷 아이디입니다."));

			bucket.reportBucket();

			reportCount = bucketRepository.save(bucket).getReport();
		}


		return ReportResDto.toDto(report, reportCount);
	}

}
