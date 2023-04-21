package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import com.a307.ifIDieTomorrow.domain.repository.PhotoRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {
	
	private final CategoryRepository categoryRepository;
	
	private final PhotoRepository photoRepository;
	
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
	public List<CreateCategoryResDto> getCategory(Long userId) {
		return categoryRepository.findAllByUserId(userId);
	}
	
	@Override
	public CreateCategoryResDto updateCategory (UpdateCategoryDto data) throws NotFoundException {
		Category category = categoryRepository.findByCategoryId(data.getCategoryId())
				.orElseThrow(() -> new NotFoundException("존재하지 않는 카테고리 ID 입니다."));
		
		category.updateCategory(data.getName());
		
		return CreateCategoryResDto.toDto(categoryRepository.save(category));
	}
	
	@Override
	public Long deleteCategory (Long categoryId) throws NotFoundException {
		Category category = categoryRepository.findByCategoryId(categoryId)
				.orElseThrow(() -> new NotFoundException("존재하지 않는 카테고리 ID 입니다."));
		
		// 카테고리에 엮인 사진 모두 삭제
		photoRepository.deleteAllInBatchByPhotoIdIn(photoRepository.findAllPhotoIdByCategory_CategoryId(categoryId));
		
		// 카테고리 삭제
		categoryRepository.delete(category);
		
		return categoryId;
	}
	
	//////////////////////////
	// APIs For PHOTO CLOUD //
	//////////////////////////
	
}
