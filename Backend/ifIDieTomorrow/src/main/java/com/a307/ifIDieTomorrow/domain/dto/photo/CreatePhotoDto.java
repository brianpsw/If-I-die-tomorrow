package com.a307.ifIDieTomorrow.domain.dto.photo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePhotoDto {
	
	private Long categoryId;
	private String caption;
	
}
