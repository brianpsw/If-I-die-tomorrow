package com.a307.ifIDieTomorrow.domain.dto.photo;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class GetPhotoResDto {
	
	private Long photoId;
	private String imageUrl;
	private String caption;
	private String imageType;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
}
