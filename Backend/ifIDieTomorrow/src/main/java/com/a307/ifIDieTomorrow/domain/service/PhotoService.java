package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;

public interface PhotoService {
	CreateCategoryResDto createCategory (CreateCategoryDto data);
	
	CreateCategoryResDto updateCategory (UpdateCategoryDto data) throws NotFoundException;
}
