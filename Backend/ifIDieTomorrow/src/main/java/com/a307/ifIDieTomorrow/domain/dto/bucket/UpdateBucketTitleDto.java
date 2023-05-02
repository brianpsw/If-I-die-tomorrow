package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdateBucketTitleDto {
	
	private Long bucketId;
	private String title;
	
}
