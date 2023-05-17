package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.UpdateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.dto.community.ReportReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.ReportResDto;
import com.a307.ifIDieTomorrow.global.exception.BadRequestException;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;


public interface CommunityService {


	GetPageDto getBucketWithComments(Integer pageNo, Integer pageSize);


	GetPageDto getDiaryWithComments(Integer pageNo, Integer pageSize);

	CreateCommentResDto createComment(CreateCommentReqDto req) throws NotFoundException, IllegalArgumentException;

	Long deleteComment(Long commentId) throws NotFoundException, UnAuthorizedException;

	CreateCommentResDto updateComment(UpdateCommentReqDto req) throws NotFoundException, UnAuthorizedException, IllegalArgumentException;

	ReportResDto createReport(ReportReqDto req) throws NotFoundException, BadRequestException;
}
