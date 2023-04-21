package com.a307.ifIDieTomorrow.domain.dto.community;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBucketWithCommentDto {

	private GetBucketResDto bucket;
	private List<GetCommentResDto> comments;

}
