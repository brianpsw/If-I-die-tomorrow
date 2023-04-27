package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoByCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.UpdatePhotoDto;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PhotoService {
	CreateCategoryResDto createCategory (CreateCategoryDto data);
	
	CreateCategoryResDto updateCategory (UpdateCategoryDto data) throws NotFoundException;
	
	Long deleteCategory (Long categoryId) throws NotFoundException;
	
	List<CreateCategoryResDto> getCategory ();
	
	CreatePhotoResDto createPhoto (CreatePhotoDto data, MultipartFile photo) throws IllegalArgumentException, IOException, NoPhotoException, NotFoundException, UnAuthorizedException;
	
	CreatePhotoResDto updatePhoto (UpdatePhotoDto data) throws NotFoundException, UnAuthorizedException;
	
	Long deletePhoto (Long photoId) throws NotFoundException, UnAuthorizedException;
	
	GetPhotoByCategoryResDto getPhotoByCategory (Long categoryId) throws NotFoundException, UnAuthorizedException;
	
	List<GetPhotoByCategoryResDto> getPhotoByUser ();

	List<GetPhotoByCategoryResDto> getPhotoByUser (Long userId);
}
