package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;
import com.a307.ifIDieTomorrow.domain.service.CommunityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "커뮤니티", description = "APIs for Community")
@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class CommunityController {

	private final CommunityService communityService;

	@GetMapping("/bucket")
	@Operation(summary = "공개 설정된 버킷 리스트", description = "공개 설정 된 버킷 + 댓글 목록입니다")
	public ResponseEntity<List<GetBucketWithCommentDto>> getBucketWithComment(){
		return ResponseEntity.status(HttpStatus.OK).body(communityService.getBucketWithComments());
	}

	@GetMapping("/diary")
	@Operation(summary = "공개 설정된 다이어리", description = "공개 설정 된 다이어리 + 댓글 목록입니다")
	public ResponseEntity<List<GetDiaryWithCommentDto>> getDiaryWithComment(){
		return ResponseEntity.status(HttpStatus.OK).body(communityService.getDiaryWithComments());
	}

	@PostMapping("/comment")
	@Operation(summary = "댓글 작성", description = "댓글 작성입니다")
	public ResponseEntity<CreateCommentResDto> createComment(
			@RequestBody CreateCommentReqDto data
	){
		return ResponseEntity.status(HttpStatus.CREATED).body(communityService.createComment(data));
	}
}
