package com.a307.ifIDieTomorrow.domain.dto.photo;

import com.a307.ifIDieTomorrow.domain.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateCategoryResDto {

	private Long categoryId;
	private String name;
	
	public static CreateCategoryResDto toDto(Category category) {
		return new CreateCategoryResDto(
				category.getCategoryId(),
				category.getName()
		);
	}
	
}
