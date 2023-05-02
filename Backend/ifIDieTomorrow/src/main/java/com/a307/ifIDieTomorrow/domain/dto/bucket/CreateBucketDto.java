package com.a307.ifIDieTomorrow.domain.dto.bucket;

import lombok.*;

@Data
@AllArgsConstructor
public class CreateBucketDto {
	
	private String title;
	private String content;
	private String complete;
	private Boolean secret;
	private Boolean hasPhoto;
	
}
