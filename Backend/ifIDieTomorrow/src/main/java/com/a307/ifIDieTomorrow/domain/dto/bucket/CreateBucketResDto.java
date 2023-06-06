package com.a307.ifIDieTomorrow.domain.dto.bucket;

import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CreateBucketResDto {
	
	private Long bucketId;
	private Long userId;
	private String title;
	private String content;
	private String complete;
	private String imageUrl;
	private Boolean secret;
	private Integer report;
	private String imageType;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	public static CreateBucketResDto toDto(Bucket bucket) {
		return new CreateBucketResDto(
				bucket.getBucketId(),
				bucket.getUserId(),
				bucket.getTitle(),
				bucket.getContent(),
				bucket.getComplete(),
				bucket.getImageUrl(),
				bucket.getSecret(),
				bucket.getReport(),
				bucket.getImageType(),
				bucket.getCreatedAt(),
				bucket.getUpdatedAt()
		);
	}
	
}
