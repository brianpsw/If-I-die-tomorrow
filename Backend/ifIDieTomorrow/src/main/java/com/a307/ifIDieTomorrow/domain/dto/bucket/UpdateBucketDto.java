package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.*;

@Data
@AllArgsConstructor
public class UpdateBucketDto {
	
	private Long bucketId;
	private Long userId;
	private String title;
	private String content;
	private Boolean complete;
	private String imageUrl;
	private Boolean secret;
	private Boolean hasPhoto;
	
}
