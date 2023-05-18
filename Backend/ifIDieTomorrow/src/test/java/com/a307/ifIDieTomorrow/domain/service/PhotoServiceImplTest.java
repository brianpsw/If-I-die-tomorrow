package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryDto;
import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.CategoryRepository;
import com.a307.ifIDieTomorrow.domain.repository.PhotoRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;

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
				void createCategoryWithoutThumbnail() {
				
				}
				
				@Test
				@DisplayName("이름이 없는 카테고리 생성")
				void createCategoryWithoutName() {
				
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
				void updateCategory() {
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 수정")
				void updateCategoryWithWrongCategoryId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 수정")
				void updateCategoryOfOtherUser() {
				
				}
				
				@Test
				@DisplayName("이름이 입력되지 않은 카테고리 수정")
				void updateCategoryWithoutName() {
				
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
				void updateCategory() {
					
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 수정")
				void updateCategoryWithWrongCategoryId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 수정")
				void updateCategoryOfOtherUser() {
				
				}
				
				@Test
				@DisplayName("사진이 입력되지 않은 카테고리 수정")
				void updateCategoryWithoutThumbnail() {
					
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
				@DisplayName("내가 만든 카테고리 삭제")
				void deleteCategory() {
				
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 카테고리 삭제")
				void deleteCategoryWithWrongCategoryId() {
					
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리 삭제")
				void deleteCategoryOfOtherUser() {
					
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
				void createPhoto() {
				
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("사진이 없는 포토 생성")
				void createPhotoWithoutImage() {
				
				}
				
				@Test
				@DisplayName("존재하지 않는 카테고리에 포토 생성")
				void createPhotoInCategoryWithWrongCategoryId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 카테고리에 포토 생성")
				void createPhotoInCategoryOfOtherUser() {
				
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
				@DisplayName("이름이 입력된 카테고리 수정")
				void updateCategory() {
				
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 포토 수정")
				void updatePhotoWithWrongPhotoId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 포토 수정")
				void updatePhotoOfOtherUser() {
				
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
				@DisplayName("내가 만든 포토 삭제")
				void deletePhoto() {
				
				}
				
			}
			
			@Nested
			@DisplayName("실패 케이스")
			class FailScenario {
				
				@Test
				@DisplayName("존재하지 않는 포토 삭제")
				void deletePhotoWithWrongPhotoId() {
				
				}
				
				@Test
				@DisplayName("다른 유저의 포토 삭제")
				void deletePhotoOfOtherUser() {
				
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
