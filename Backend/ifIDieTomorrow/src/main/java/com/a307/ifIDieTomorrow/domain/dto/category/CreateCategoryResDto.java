package com.a307.ifIDieTomorrow.domain.dto.category;

import com.a307.ifIDieTomorrow.domain.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateCategoryResDto {
	
	private Long userId;
	private Long categoryId;
	private String name;
	private Long objectId;
	
	public static CreateCategoryResDto toDto(Category category) {
		return new CreateCategoryResDto(
				category.getUserId(),
				category.getCategoryId(),
				category.getName(),
				category.getObjectId()
		);
	}
	
}
