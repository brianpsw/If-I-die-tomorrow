package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;

import java.util.List;

public interface CommunityService {

	List<GetBucketWithCommentDto> getBucketWithComments();
}
