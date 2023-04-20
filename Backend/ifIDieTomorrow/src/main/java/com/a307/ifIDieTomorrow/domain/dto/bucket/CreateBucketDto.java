package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.*;

@Data
@AllArgsConstructor
public class CreateBucketDto {
	
	private Long userId;
	private String title;
	private String content;
	private Boolean complete;
	private Boolean secret;
	private Boolean hasPhoto;
	
}
