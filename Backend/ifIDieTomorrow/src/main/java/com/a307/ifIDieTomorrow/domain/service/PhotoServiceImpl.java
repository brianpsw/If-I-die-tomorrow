package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
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
	
	@Override
	public CreateCategoryResDto updateCategory (UpdateCategoryDto data) throws NotFoundException {
		Category category = categoryRepository.findByCategoryId(data.getCategoryId())
				.orElseThrow(() -> new NotFoundException("존재하지 않는 카테고리 ID 입니다."));
		
		category.updateCategory(data.getName());
		
		return CreateCategoryResDto.toDto(categoryRepository.save(category));
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
}
