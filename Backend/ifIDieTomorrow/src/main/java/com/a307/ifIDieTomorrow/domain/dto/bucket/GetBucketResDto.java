package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBucketResDto {

	private Long bucketId;
	private Long userId;
	private String nickname;
	private String title;
	private String content;
	private String complete;
	private String imageUrl;
	private Boolean secret;
	private String imageType;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
