package com.a307.ifIDieTomorrow.domain.dto.category;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateCategoryDto {

	private Long userId;
	private String name;
	
}
