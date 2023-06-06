package com.a307.ifIDieTomorrow.domain.dto.photo;

import com.a307.ifIDieTomorrow.domain.entity.Photo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CreatePhotoResDto {
	
	private Long photoId;
	private Long categoryId;
	private String imageUrl;
	private String caption;
	private String imageType;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
	public static CreatePhotoResDto toDto(Photo photo) {
		return new CreatePhotoResDto(
				photo.getPhotoId(),
				photo.getCategory().getCategoryId(),
				photo.getImageUrl(),
				photo.getCaption(),
				photo.getImageType(),
				photo.getCreatedAt(),
				photo.getUpdatedAt()
		);
	}
}
