package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryNameDto;
import com.a307.ifIDieTomorrow.domain.dto.category.UpdateCategoryThumbnailDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.CreatePhotoResDto;
import com.a307.ifIDieTomorrow.domain.dto.photo.UpdatePhotoDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.entity.Photo;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import com.a307.ifIDieTomorrow.domain.repository.PhotoRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.ImageProcess;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import org.assertj.core.api.BDDAssertions;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PhotoServiceImplTest {
	
	@InjectMocks
	private PhotoServiceImpl photoService;
	
	@Mock
	private CategoryRepository categoryRepository;
	
	@Mock
	private PhotoRepository photoRepository;
	
	@Mock
	private S3Upload s3Upload;
	
	@Mock
	private ImageProcess imageProcess;
	
	private User user;
	private Category category0;
	
	@BeforeEach
	void setUp() {
		user = User.builder()
				.userId(1L)
				.name("tom")
				.nickname("tommy")
				.email("tom@email.com")
				.sendAgree(false)
				.newCheck(true)
				.deleted(false)
				.providerType(ProviderType.NAVER)
				.build();
		
		UserPrincipal userPrincipal = UserPrincipal.create(user);
		TestingAuthenticationToken authentication = new TestingAuthenticationToken(userPrincipal, null);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		
		category0 = Category.builder()
				.categoryId(0L)
				.name("test")
				.imageUrl("test.com")
				.userId(1L)
				.build();
	}
	
	@AfterEach
	void tearDown() {
		photoRepository.deleteAllInBatch();
		categoryRepository.deleteAllInBatch();
	}
	
	////////////////////////
	// Tests For CATEGORY //
	////////////////////////
	
	@Nested
	@DisplayName("카테고리")
	class CategoryTest {
		
		@Nested
		@DisplayName("카테고리 생성")
		class createCategoryTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("썸네일과 이름이 있는 카테고리 생성")
				void createCategory() throws ImageProcessingException, IOException, MetadataException, IllegalArgumentException, NoPhotoException {
					
					// Given
					CreateCategoryDto data = new CreateCategoryDto("test name");
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					Category category = Category.builder()
							.categoryId(1L)
							.userId(1L)
							.name(data.getName())
							.imageUrl("https://example.com/test.jpg")
							.build();
					
					/* stubbing */
					given(categoryRepository.save(any(Category.class))).willReturn(category);
					given(s3Upload.upload(photo, "category")).willReturn("https://example.com/test.jpg");
					given(imageProcess.resizeImage(photo, 100)).willReturn(photo);
					
					// When
					CreateCategoryResDto result = photoService.createCategory(data, photo);
					ArgumentCaptor<Category> categoryCaptor = ArgumentCaptor.forClass(Category.class);
					
					// Then
					/* 동작 검증 */
					then(s3Upload).should().upload(photo, "category");
					then(categoryRepository).should().save(categoryCaptor.capture());
					
					/* 인자 검증 */
					Category capturedCategory = categoryCaptor.getValue();
					BDDAssertions.then(capturedCategory.getUserId()).isEqualTo(1L);
					BDDAssertions.then(capturedCategory.getImageUrl()).isEqualTo("https://example.com/test.jpg");
					
					/* 결과 검증 */
					BDDAssertions.then(result.getCategoryId()).isEqualTo(category.getCategoryId());
					BDDAssertions.then(result.getUserId()).isEqualTo(category.getUserId());
					BDDAssertions.then(result.getImageUrl()).isEqualTo(category.getImageUrl());
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("썸네일이 없는 카테고리 생성")
				void createCategoryWithoutThumbnail() throws ImageProcessingException, IOException, IllegalArgumentException, MetadataException, NoPhotoException {
					
					// Given
					CreateCategoryDto data = new CreateCategoryDto("test name");
					
					// When
					
					// Then
					/* 동작 검증 */
					then(s3Upload).shouldHaveNoInteractions();
					BDDAssertions.thenThrownBy(() -> photoService.createCategory(data, null))
							.isInstanceOf(NoPhotoException.class);
					
				}
				
				@Test
				@DisplayName("이름이 없는 카테고리 생성")
				void createCategoryWithoutName() {
					
					// Given
					CreateCategoryDto data = new CreateCategoryDto("");
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					// When
					
					// Then
					/* 동작 검증 */
					then(s3Upload).shouldHaveNoInteractions();
					BDDAssertions.thenThrownBy(() -> photoService.createCategory(data, photo))
							.isInstanceOf(IllegalArgumentException.class);
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("카테고리 조회")
		class getCategoryTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("내 카테고리 조회")
				void getCategory() {
					
					// Given
					List<CreateCategoryResDto> list = List.of(CreateCategoryResDto.toDto(category0));
					
					/* stubbing */
					given(categoryRepository.findAllCategoryByUserId(1L)).willReturn(list);
					
					// When
					List<CreateCategoryResDto> result = photoService.getCategory();
					
					// Then
					BDDAssertions.then(result.size()).isEqualTo(1);
					BDDAssertions.then(result).isEqualTo(list);
					
					then(categoryRepository).should().findAllCategoryByUserId(1L);
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("카테고리 수정(이름)")
		class updateCategoryNameTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("이름이 입력된 카테고리 수정")
				void updateCategory() throws NotFoundException, IllegalArgumentException, UnAuthorizedException {
					
					// Given
					UpdateCategoryNameDto data = new UpdateCategoryNameDto(0L, "test2");
					
					Category updatedCategory = Category.builder()
							.categoryId(0L)
							.userId(1L)
							.name(data.getName())
							.imageUrl("test.com")
							.build();
					
					/* stubbing */
					given(categoryRepository.save(any(Category.class))).willReturn(updatedCategory);
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					
					// When
					CreateCategoryResDto result = photoService.updateCategoryName(data);
					
					// Then
					then(categoryRepository).should().findByCategoryId(data.getCategoryId());
					then(s3Upload).shouldHaveNoInteractions();
					
					BDDAssertions.then(result.getCategoryId()).isEqualTo(0L);
					BDDAssertions.then(result.getUserId()).isEqualTo(1L);
					BDDAssertions.then(result.getName()).isEqualTo(data.getName());
					BDDAssertions.then(result.getImageUrl()).isEqualTo(category0.getImageUrl());
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 수정")
				void updateCategoryWithWrongCategoryId() {
					
					// Given
					UpdateCategoryNameDto data = new UpdateCategoryNameDto(123L, "test2");
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryName(data))
							.isInstanceOf(NotFoundException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 수정")
				void updateCategoryOfOtherUser() {
					
					// Given
					UpdateCategoryNameDto data = new UpdateCategoryNameDto(1L, "test2");
					
					Category existingCategory = Category.builder()
									.categoryId(1L)
									.name("new")
									.imageUrl("new.com")
									.userId(2L)
									.build();
					
					given(categoryRepository.findByCategoryId(data.getCategoryId())).willReturn(Optional.of(existingCategory));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryName(data))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("이름이 입력되지 않은 카테고리 수정")
				void updateCategoryWithoutName() {
					
					// Given
					UpdateCategoryNameDto data = new UpdateCategoryNameDto(0L, "");
					
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryName(data))
							.isInstanceOf(IllegalArgumentException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("카테고리 수정(썸네일)")
		class updateCategoryThumbnailTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("사진이 입력된 카테고리 수정")
				void updateCategory() throws ImageProcessingException, IOException, MetadataException, NotFoundException, IllegalArgumentException, NoPhotoException, UnAuthorizedException {
					
					// Given
					UpdateCategoryThumbnailDto data = new UpdateCategoryThumbnailDto(0L);
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					Category updatedCategory = Category.builder()
							.categoryId(0L)
							.userId(1L)
							.name("test")
							.imageUrl("test2.com")
							.build();
					
					/* stubbing */
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					given(imageProcess.resizeImage(photo, 100)).willReturn(photo);
					given(s3Upload.upload(photo, "category")).willReturn("test2.com");
					given(categoryRepository.save(any(Category.class))).willReturn(updatedCategory);
					
					// When
					CreateCategoryResDto result = photoService.updateCategoryThumbnail(data, photo);
					
					// Then
					then(categoryRepository).should().findByCategoryId(data.getCategoryId());
					then(imageProcess).should().resizeImage(photo, 100);
					then(s3Upload).should().delete(any(String.class));
					then(s3Upload).should().upload(photo, "category");
					
					BDDAssertions.then(result.getCategoryId()).isEqualTo(0L);
					BDDAssertions.then(result.getUserId()).isEqualTo(1L);
					BDDAssertions.then(result.getImageUrl()).isEqualTo("test2.com");
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 수정")
				void updateCategoryWithWrongCategoryId() {
					
					// Given
					UpdateCategoryThumbnailDto data = new UpdateCategoryThumbnailDto(123L);
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryThumbnail(data, photo))
							.isInstanceOf(NotFoundException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 수정")
				void updateCategoryOfOtherUser() {
					
					// Given
					UpdateCategoryThumbnailDto data = new UpdateCategoryThumbnailDto(1L);
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					Category existingCategory = Category.builder()
							.categoryId(1L)
							.name("new")
							.imageUrl("new.com")
							.userId(2L)
							.build();
					
					given(categoryRepository.findByCategoryId(1L)).willReturn(Optional.of(existingCategory));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryThumbnail(data, photo))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("사진이 입력되지 않은 카테고리 수정")
				void updateCategoryWithoutThumbnail() {
					
					// Given
					UpdateCategoryThumbnailDto data = new UpdateCategoryThumbnailDto(0L);
					
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updateCategoryThumbnail(data, null))
							.isInstanceOf(NoPhotoException.class);
					
					then(categoryRepository).should(never()).save(any(Category.class));
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("카테고리 삭제")
		class deleteCategoryTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("내 카테고리 삭제")
				void deleteCategory() throws NotFoundException, UnAuthorizedException {
					
					// Given
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					
					// When
					Long categoryId = photoService.deleteCategory(0L);
					
					// Then
					then(categoryRepository).should().findByCategoryId(categoryId);
					then(photoRepository).should().deleteAllByCategory_CategoryId(categoryId);
					then(categoryRepository).should().delete(category0);
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 삭제")
				void deleteCategoryWithWrongCategoryId() {
					
					// Given
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.deleteCategory(123L))
							.isInstanceOf(NotFoundException.class);
					
					then(categoryRepository).should().findByCategoryId(123L);
					then(categoryRepository).should(never()).delete(any());
					
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 삭제")
				void deleteCategoryOfOtherUser() {
					
					// Given
					Category existingCategory = Category.builder()
							.categoryId(1L)
							.name("test1")
							.imageUrl("test1.com")
							.userId(2L)
							.build();
					
					given(categoryRepository.findByCategoryId(1L)).willReturn(Optional.of(existingCategory));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.deleteCategory(1L))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(categoryRepository).should().findByCategoryId(1L);
					then(categoryRepository).should(never()).delete(any());
					
				}
				
			}
			
		}
		
	}
	
	///////////////////////////
	// Tests For PHOTO CLOUD //
	///////////////////////////
	
	@Nested
	@DisplayName("포토 클라우드")
	class PhotoTest {
		
		@Nested
		@DisplayName("포토 생성")
		class createPhotoTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("사진과 캡션이 있는 포토 생성")
				void createPhoto() throws ImageProcessingException, IOException, MetadataException, NotFoundException, UnAuthorizedException, NoPhotoException {
					
					// Given
					CreatePhotoDto data = new CreatePhotoDto(0L, "test caption");
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					Photo savedPhoto = Photo.builder()
							.photoId(1L)
							.userId(1L)
							.category(category0)
							.imageUrl("test.com")
							.caption("test caption")
							.imageType("image")
							.build();
					
					given(categoryRepository.findByCategoryId(0L)).willReturn(Optional.of(category0));
					given(photoRepository.save(any(Photo.class))).willReturn(savedPhoto);
					given(s3Upload.upload(photo, "photo")).willReturn("test.com");
					
					
					// When
					CreatePhotoResDto result = photoService.createPhoto(data, photo);
					ArgumentCaptor<Photo> captor = ArgumentCaptor.forClass(Photo.class);
					
					// Then
					/**
					 * 동작 검증
					 * 사진이 업로드됨
					 * 포토클라우드에 저장됨
					 */
					then(s3Upload).should().upload(photo, "photo");
					then(photoRepository).should().save(captor.capture());
					
					/**
					 * 파라미터 검증
					 * categoryId, caption
					 */
					Photo capturedPhoto = captor.getValue();
					BDDAssertions.then(capturedPhoto.getCategory().getCategoryId()).isEqualTo(0L);
					BDDAssertions.then(capturedPhoto.getCaption()).isEqualTo("test caption");
					
					/**
					 * 결과 검증
					 * photoId, categoryId, imageUrl, imageType
					 */
					BDDAssertions.then(result.getPhotoId()).isEqualTo(1L);
					BDDAssertions.then(result.getCategoryId()).isEqualTo(0L);
					BDDAssertions.then(result.getImageUrl()).isEqualTo("test.com");
					BDDAssertions.then(result.getImageType()).isEqualTo("image");
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("사진이 없는 포토 생성")
				void createPhotoWithoutImage() {
					
					// Given
					CreatePhotoDto data = new CreatePhotoDto(0L, "test caption");
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.createPhoto(data, null))
							.isInstanceOf(NoPhotoException.class);
					
					then(photoRepository).shouldHaveNoInteractions();
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("존재하지 않는 카테고리에 포토 생성")
				void createPhotoInCategoryWithWrongCategoryId() {
					
					// Given
					CreatePhotoDto data = new CreatePhotoDto(123L, "test caption");
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.createPhoto(data, photo))
							.isInstanceOf(NotFoundException.class);
					
					then(photoRepository).shouldHaveNoInteractions();
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리에 포토 생성")
				void createPhotoInCategoryOfOtherUser() {
					
					// Given
					CreatePhotoDto data = new CreatePhotoDto(1L, "test caption");
					MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());
					
					Category category = Category.builder()
								.userId(2L)
								.categoryId(1L)
								.name("other's")
								.imageUrl("other.com")
								.build();
					
					given(categoryRepository.findByCategoryId(1L)).willReturn(Optional.of(category));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.createPhoto(data, photo))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(photoRepository).shouldHaveNoInteractions();
					then(s3Upload).shouldHaveNoInteractions();
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("포토 수정")
		class updatePhotoTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("캡션이 입력된 포토 수정")
				void updateCategory() throws NotFoundException, UnAuthorizedException {
					
					// Given
					Photo savedPhoto = Photo.builder()
							.photoId(1L)
							.userId(1L)
							.category(category0)
							.imageUrl("test.com")
							.caption("test caption")
							.imageType("image")
							.build();
					
					Photo updatedPhoto = Photo.builder()
							.photoId(1L)
							.userId(1L)
							.category(category0)
							.imageUrl("test.com")
							.caption("new caption")
							.imageType("image")
							.build();
					
					UpdatePhotoDto data = new UpdatePhotoDto(1L, "new caption");
					
					given(photoRepository.findByPhotoId(data.getPhotoId())).willReturn(Optional.of(savedPhoto));
					given(photoRepository.save(any(Photo.class))).willReturn(updatedPhoto);
					
					// When
					CreatePhotoResDto result = photoService.updatePhoto(data);
					
					// Then
					/**
					 * 결과 검증
					 * photoId, caption
					 */
					BDDAssertions.then(result.getPhotoId()).isEqualTo(1L);
					BDDAssertions.then(result.getCaption()).isEqualTo("new caption");
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 포토 수정")
				void updatePhotoWithWrongPhotoId() {
					
					// Given
					UpdatePhotoDto data = new UpdatePhotoDto(9999L, "new caption");
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updatePhoto(data))
							.isInstanceOf(NotFoundException.class);
					
					then(photoRepository).should(never()).save(any(Photo.class));
					
				}
				
				@Test
				@DisplayName("다른 유저의 포토 수정")
				void updatePhotoOfOtherUser() {
					
					// Given
					Photo savedPhoto = Photo.builder()
							.photoId(1L)
							.userId(2L)
							.category(category0)
							.imageUrl("test.com")
							.caption("it's not yours")
							.imageType("image")
							.build();
					
					UpdatePhotoDto data = new UpdatePhotoDto(1L, "new caption");
					
					given(photoRepository.findByPhotoId(data.getPhotoId())).willReturn(Optional.of(savedPhoto));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.updatePhoto(data))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(photoRepository).should(never()).save(any(Photo.class));
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("포토 삭제")
		class deletePhotoTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("내 포토 삭제")
				void deletePhoto() throws NotFoundException, UnAuthorizedException {
					
					// Given
					Photo savedPhoto = Photo.builder()
							.photoId(1L)
							.userId(1L)
							.category(category0)
							.imageUrl("test.com")
							.caption("test caption")
							.imageType("image")
							.build();
					
					given(photoRepository.findByPhotoId(1L)).willReturn(Optional.of(savedPhoto));
					ArgumentCaptor<Photo> captor = ArgumentCaptor.forClass(Photo.class);
					
					// When
					Long deletedPhotoId = photoService.deletePhoto(1L);
					
					// Then
					/**
					 * 동작 검증
					 * S3 이미지 삭제
					 * 포토 삭제 
					 */
					then(s3Upload).should().delete(savedPhoto.getImageUrl());
					then(photoRepository).should().delete(captor.capture());
					
					/**
					 * 파라미터 검증
					 * photoId
					 */
					Photo capturedPhoto = captor.getValue();
					BDDAssertions.then(capturedPhoto.getPhotoId()).isEqualTo(deletedPhotoId);
					
					/**
					 * 결과 검증
					 * photoId
					 */
					BDDAssertions.then(deletedPhotoId).isEqualTo(1L);
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 포토 삭제")
				void deletePhotoWithWrongPhotoId() {
					
					// Given
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.deletePhoto(9999L))
							.isInstanceOf(NotFoundException.class);
					
					then(s3Upload).should(never()).delete(any(String.class));
					then(photoRepository).should(never()).delete(any(Photo.class));
					
				}
				
				@Test
				@DisplayName("다른 유저의 포토 삭제")
				void deletePhotoOfOtherUser() {
					
					// Given
					Photo savedPhoto = Photo.builder()
							.photoId(1L)
							.userId(2L)
							.category(category0)
							.imageUrl("test.com")
							.caption("it's not yours")
							.imageType("image")
							.build();
					
					given(photoRepository.findByPhotoId(1L)).willReturn(Optional.of(savedPhoto));
					
					// When
					
					// Then
					BDDAssertions.thenThrownBy(() -> photoService.deletePhoto(1L))
							.isInstanceOf(UnAuthorizedException.class);
					
					then(s3Upload).should(never()).delete(any(String.class));
					then(photoRepository).should(never()).delete(any(Photo.class));
					
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("포토 조회(카테고리)")
		class getPhotoByCategoryTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("내가 만든 카테고리의 포토 조회")
				void getPhotoByCategory() {
				
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리의 포토 조회")
				void getPhotoByCategoryWithWrongCategoryId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리의 포토 조회")
				void getPhotoByCategoryOfOtherUser() {
				
				}
				
			}
			
		}
		
		@Nested
		@DisplayName("포토 조회(유저)")
		class getPhotoByUserTest {
			
			@Nested
			@DisplayName("성공 케이스")
			class NormalScenario {
				
				@Test
				@DisplayName("내 포토 조회")
				void getPhotoByUser() {
				
				}
				
			}
			
		}
		
	}
	
}
