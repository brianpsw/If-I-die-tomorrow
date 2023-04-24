package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.*;

@Data
@AllArgsConstructor
public class UpdateBucketDto {
	
	private Long bucketId;
	private String title;
	private String content;
	private Boolean complete;
	private Boolean secret;
	private Boolean updatePhoto;
	
}
