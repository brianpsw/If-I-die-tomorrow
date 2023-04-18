package com.a307.ifIDieTomorrow.domain.dto;

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
	
	public static CreateBucketDto toDto(Bucket bucket) {
		return new CreateBucketDto(
				bucket.getUserId(),
				bucket.getTitle(),
				bucket.getContent(),
				bucket.getComplete(),
				bucket.getImageUrl(),
				bucket.getSecret()
		);
	}
	
}
