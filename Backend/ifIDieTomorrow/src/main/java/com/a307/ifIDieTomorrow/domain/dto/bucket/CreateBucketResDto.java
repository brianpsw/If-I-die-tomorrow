package com.a307.ifIDieTomorrow.domain.dto.bucket;

import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Setter
@Getter
@ToString
@AllArgsConstructor
public class CreateBucketResDto {
	
	private Long userId;
	private String title;
	private String content;
	private Boolean complete;
	private String imageUrl;
	private Boolean secret;
	private Integer report;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	public static CreateBucketResDto toDto(Bucket bucket) {
		return new CreateBucketResDto(
				bucket.getUserId(),
				bucket.getTitle(),
				bucket.getContent(),
				bucket.getComplete(),
				bucket.getImageUrl(),
				bucket.getSecret(),
				bucket.getReport(),
				bucket.getCreatedAt(),
				bucket.getUpdatedAt()
		);
	}
	
}
