package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;

import java.util.List;

public interface CommunityService {

	List<GetBucketWithCommentDto> getBucketWithComments();

	List<GetDiaryWithCommentDto> getDiaryWithComments();

	CreateCommentResDto createComment(CreateCommentReqDto req);
}
