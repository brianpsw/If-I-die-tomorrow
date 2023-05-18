package com.a307.ifIDieTomorrow.domain.dto.photo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatePhotoDto {
	
	private Long photoId;
	private String caption;
	
}
