package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {
	
	private final CategoryRepository categoryRepository;
	
	///////////////////////
	// APIs For CATEGORY //
	///////////////////////
	
	@Override
	public CreateCategoryResDto createCategory (CreateCategoryDto data) {
		Category category = Category.builder().
				userId(data.getUserId()).
				name(data.getName()).
				build();
		
		return CreateCategoryResDto.toDto(categoryRepository.save(category));
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
}
