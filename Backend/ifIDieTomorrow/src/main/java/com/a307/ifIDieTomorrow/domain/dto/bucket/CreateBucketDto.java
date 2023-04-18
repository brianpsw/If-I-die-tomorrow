package com.a307.ifIDieTomorrow.domain.dto.bucket;

import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
@AllArgsConstructor
public class CreateBucketDto {
	
	private Long userId;
	private String title;
	private String content;
	private Boolean complete;
	private String imageUrl;
	private Boolean secret;
	private Boolean hasPhoto;
	
}
