package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.UpdateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.dto.community.ReportReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.ReportResDto;
import com.a307.ifIDieTomorrow.domain.service.CommunityService;
import com.a307.ifIDieTomorrow.global.exception.BadRequestException;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "커뮤니티", description = "APIs for Community")
@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class CommunityController {

	private final CommunityService communityService;

	@GetMapping("/bucket")
	@Operation(summary = "공개 설정된 버킷 리스트", description = "공개 설정 된 버킷 + 댓글 목록입니다")
	public ResponseEntity<GetPageDto> getBucketWithComment(
			@RequestParam(name = "page", required = false) Integer pageNo,
			@RequestParam(name = "size", required = false) Integer pageSize
	){
		return ResponseEntity.status(HttpStatus.OK).body(communityService.getBucketWithComments(pageNo, pageSize));
	}

	@GetMapping("/diary")
	@Operation(summary = "공개 설정된 다이어리", description = "공개 설정 된 다이어리 + 댓글 목록입니다")
	public ResponseEntity<GetPageDto> getDiaryWithComment(
			@RequestParam(name = "page", required = false) Integer pageNo,
			@RequestParam(name = "size", required = false) Integer pageSize
	){
		return ResponseEntity.status(HttpStatus.OK).body(communityService.getDiaryWithComments(pageNo, pageSize));
	}

	@PostMapping("/comment")
	@Operation(summary = "댓글 작성", description = "댓글 작성입니다")
	public ResponseEntity<CreateCommentResDto> createComment(
			@RequestBody CreateCommentReqDto data
	) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createComment(data));
	}

	@PutMapping("/comment")
	@Operation(summary = "댓글 수정", description = "댓글 수정입니다")
	public ResponseEntity<CreateCommentResDto> updateComment(
			@RequestBody UpdateCommentReqDto data
	) throws NotFoundException, UnAuthorizedException, IllegalArgumentException {
		return ResponseEntity.status(HttpStatus.OK).body(communityService.updateComment(data));
	}

	@DeleteMapping("/comment/{commentId}")
	@Operation(summary = "댓글 삭제", description = "댓글 삭제입니다.")
	public ResponseEntity<Long> deleteComment(@PathVariable Long commentId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(communityService.deleteComment(commentId));
	}

	@PostMapping("/report")
	@Operation(summary = "신고", description = "버킷/다이어리 신고, 신고 횟수가 5회를 넘어가면 자동으로 비공개 전환됩니다.")
	public ResponseEntity<ReportResDto> reportDiaryOrBucket(
			@RequestBody ReportReqDto data
			) throws NotFoundException, BadRequestException {
		return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createReport(data));
	}

}
