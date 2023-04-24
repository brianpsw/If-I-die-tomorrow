package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.UpdatePhotoDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.entity.Photo;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import com.a307.ifIDieTomorrow.domain.repository.PhotoRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoServiceImpl implements PhotoService {
	
	private final String PHOTO = "photo";
	
	private final S3Upload s3Upload;
	
	private final CategoryRepository categoryRepository;
	
	private final PhotoRepository photoRepository;
	
	///////////////////////
	// APIs For CATEGORY //
	///////////////////////
	
	@Override
	public CreateCategoryResDto createCategory (CreateCategoryDto data) {
		Category category = Category.builder().
				userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()).
				name(data.getName()).
				build();
		
		return CreateCategoryResDto.toDto(categoryRepository.save(category));
	}
	
	@Override
	public List<CreateCategoryResDto> getCategory () {
		return categoryRepository.findAllByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
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
	
	@Override
	public CreatePhotoResDto createPhoto (CreatePhotoDto data, MultipartFile photo) throws IllegalArgumentException, IOException, NoPhotoException, NotFoundException, UnAuthorizedException {
		if (photo == null) throw new NoPhotoException("사진이 없습니다.");
		
		Category category = categoryRepository.findByCategoryId(data.getCategoryId())
				.orElseThrow(() -> new NotFoundException("존재하지 않는 카테고리 ID 입니다."));
		
		Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
		
		if (category.getUserId() != 0 && !category.getUserId().equals(userId)) throw new UnAuthorizedException("접근할 수 없는 카테고리 ID 입니다.");
		
		Photo photoEntity = Photo.builder().
				category(category).
				userId(userId).
				imageUrl(s3Upload.uploadFiles(photo, PHOTO)).
				caption(data.getCaption()).
				build();
		
		return CreatePhotoResDto.toDto(photoRepository.save(photoEntity));
	}
	
	@Override
	public CreatePhotoResDto updatePhoto (UpdatePhotoDto data) throws NotFoundException, UnAuthorizedException {
		Photo photo = photoRepository.findByPhotoId(data.getPhotoId())
				.orElseThrow(() -> new NotFoundException("존재하지 않는 버킷 ID 입니다."));
		
		Long userId = ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId();
		
		if (photo.getUserId() != 0 && !photo.getUserId().equals(userId)) throw new UnAuthorizedException("접근할 수 없는 포토 ID 입니다.");
		
		photo.updateCategory(data.getCaption());
		
		return CreatePhotoResDto.toDto(photoRepository.save(photo));
	}
	
}
