package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryResDto;

public interface PhotoService {
	CreateCategoryResDto createCategory (CreateCategoryDto data);
}
