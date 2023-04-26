package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.service.CommunityService;
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
	){
		return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createComment(data));
	}

	@DeleteMapping("/comment/{commentId}")
	@Operation(summary = "댓글 삭제", description = "댓글 삭제입니다.")
	public ResponseEntity<Long> deleteComment(@PathVariable Long commentId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(communityService.deleteComment(commentId));
	}
}
