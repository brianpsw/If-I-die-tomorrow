package com.a307.ifIDieTomorrow.domain.dto.photo;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateCategoryDto {

	private Long userId;
	private String name;
	
}
