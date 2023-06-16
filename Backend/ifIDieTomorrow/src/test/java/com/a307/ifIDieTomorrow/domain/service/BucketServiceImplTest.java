package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketWithTitleDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.UpdateBucketTitleDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.UpdateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class BucketServiceImplTest {

	@InjectMocks
	private BucketServiceImpl bucketService;
	
	@Mock
	private BucketRepository bucketRepository;
	
	@Mock
	private CommentRepository commentRepository;
	
	@Mock
	private S3Upload s3Upload;
	
	private User user;

	/**
	 * 테스트용 유저 및 인증 객체 생성
	 */
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
		bucketRepository.deleteAllInBatch();
		commentRepository.deleteAllInBatch();
	}

	@DisplayName("버킷 생성")
	@Nested
	class CreateBucketTest {
		
		@DisplayName("성공 케이스")
		@Nested
		class NormalScenario {
			
			@Test
			@DisplayName("제목 입력됨")
			void createBucketWithTitle() throws IllegalArgumentException {
				
				// given
				CreateBucketWithTitleDto data = new CreateBucketWithTitleDto("Test Title");
				
				Bucket savedBucket = Bucket.builder()
						.bucketId(1L)
						.userId(1L)
						.title(data.getTitle())
						.build();
				
				/**
				 * 정상 동작 stubbing
				 */
				given(bucketRepository.save(any(Bucket.class))).willReturn(savedBucket);
				
				// when
				CreateBucketResDto result = bucketService.createBucketWithTitle(data);
				ArgumentCaptor<Bucket> bucketCaptor = ArgumentCaptor.forClass(Bucket.class);
				
				// then
				/**
				 * 동작 검증
				 * 버킷이 저장 되는가
				 */
				then(bucketRepository).should().save(bucketCaptor.capture());
				
				/**
				 * 전달된 인자 검증
				 * 유저 아이디가 정상적으로 들어갔는가
				 */
				Bucket capturedBucket = bucketCaptor.getValue();
				BDDAssertions.then(capturedBucket.getUserId()).isEqualTo(1L);
				
				/**
				 * 결괏값 검증
				 * 버킷 아이디
				 * 유저아이디
				 */
				BDDAssertions.then(result.getBucketId()).isEqualTo(savedBucket.getBucketId());
				BDDAssertions.then(result.getUserId()).isEqualTo(savedBucket.getUserId());
				
			}
			
		}
		
		@DisplayName("예외 케이스")
		@Nested
		class ExceptionScenario {
			
			@Test
			@DisplayName("제목 없음")
			void createBucketWithoutTitle() {
				
				// given
				CreateBucketWithTitleDto data = new CreateBucketWithTitleDto("");
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.createBucketWithTitle(data))
						.isInstanceOf(IllegalArgumentException.class);
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				
			}
			
		}

	}
	
	@Nested
	@DisplayName("버킷 업데이트")
	class UpdateBucketTest {
		
		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {
			
			@Test
			@DisplayName("내용 수정과 사진 수정")
			void updateWithNewPhoto() throws IOException, IllegalArgumentException, NotFoundException, UnAuthorizedException, ImageProcessingException, MetadataException {
				
				// given
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content(null)
						.secret(true)
						.report(0)
						.complete(null)
						.imageUrl(null)
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("updated title")
						.content("updated content")
						.secret(false)
						.complete("2023-05-09")
						.updatePhoto(true)
						.build();
				
				MultipartFile photo = new MockMultipartFile("file", "new_test.jpg", "image/jpeg", "new_test".getBytes());
				
				/**
				 * 수정된 버킷 (expected)
				 */
				Bucket updatedBucket = Bucket.builder()
						.bucketId(1L)
						.title(data.getTitle())
						.userId(1L)
						.complete(data.getComplete())
						.content(data.getContent())
						.secret(data.getSecret())
						.report(0)
						.imageUrl("https://example.com/new_test.jpg")
						.build();
				
				/**
				 * 스터빙
				 */
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				given(s3Upload.upload(photo, "bucket")).willReturn("https://example.com/new_test.jpg");
				given(bucketRepository.save(any(Bucket.class))).willReturn(updatedBucket);
				
				// when
				CreateBucketResDto result = bucketService.updateBucket(data, photo);
				
				// then
				
				/**
				 * 동작 검증
				 * 버킷 조회
				 * 신규 사진 업로드
				 */
				then(bucketRepository).should().findByBucketId(data.getBucketId());
				then(s3Upload).should(never()).delete(any(String.class));
				then(s3Upload).should().upload(photo, "bucket");
				
				/**
				 * 결과 검증
				 */
				BDDAssertions.then(result.getTitle()).isEqualTo(updatedBucket.getTitle());
				BDDAssertions.then(result.getContent()).isEqualTo(updatedBucket.getContent());
				BDDAssertions.then(result.getSecret()).isEqualTo(updatedBucket.getSecret());
				BDDAssertions.then(result.getImageUrl()).isEqualTo(updatedBucket.getImageUrl());
				
			}
			
			@Test
			@DisplayName("내용 수정")
			void updatedWithNoPhoto() throws ImageProcessingException, NotFoundException, IOException, UnAuthorizedException, MetadataException, IllegalArgumentException {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content(null)
						.secret(true)
						.report(0)
						.complete(null)
						.imageUrl(null)
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("updated title")
						.content("updated content")
						.secret(false)
						.complete("2023-05-09")
						.updatePhoto(false)
						.build();
				
				/**
				 * 수정된 버킷 (expected)
				 */
				Bucket updatedBucket = Bucket.builder()
						.bucketId(1L)
						.title(data.getTitle())
						.userId(1L)
						.complete(data.getComplete())
						.content(data.getContent())
						.secret(data.getSecret())
						.report(0)
						.imageUrl(null)
						.build();
				
				/**
				 * 스터빙
				 */
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				given(bucketRepository.save(any(Bucket.class))).willReturn(updatedBucket);
				
				// when
				CreateBucketResDto result = bucketService.updateBucket(data, null);
				
				// then
				/**
				 * 동작 검증
				 * 버킷 조회
				 * 사진 없음
				 */
				then(bucketRepository).should().findByBucketId(data.getBucketId());
				then(s3Upload).shouldHaveNoInteractions();
				
				/**
				 * 결과 검증
				 */
				BDDAssertions.then(result.getTitle()).isEqualTo(updatedBucket.getTitle());
				BDDAssertions.then(result.getContent()).isEqualTo(updatedBucket.getContent());
				BDDAssertions.then(result.getSecret()).isEqualTo(updatedBucket.getSecret());
				BDDAssertions.then(result.getImageUrl()).isEqualTo(updatedBucket.getImageUrl());
				
			}
			
			@Test
			@DisplayName("내용 수정과 기존 사진 삭제")
			void updatedAndDeletePhoto() throws ImageProcessingException, NotFoundException, IOException, UnAuthorizedException, MetadataException, IllegalArgumentException {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content(null)
						.secret(false)
						.report(0)
						.complete("2023-06-12")
						.imageUrl("test.com")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("updated title")
						.content("updated content")
						.secret(false)
						.complete("2023-06-12")
						.updatePhoto(true)
						.build();
				
				/**
				 * 수정된 버킷 (expected)
				 */
				Bucket updatedBucket = Bucket.builder()
						.bucketId(1L)
						.title(data.getTitle())
						.userId(1L)
						.complete(data.getComplete())
						.content(data.getContent())
						.secret(data.getSecret())
						.report(0)
						.imageUrl("")
						.build();
				
				/**
				 * 스터빙
				 */
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				given(bucketRepository.save(any(Bucket.class))).willReturn(updatedBucket);
				
				// when
				CreateBucketResDto result = bucketService.updateBucket(data, null);
				
				// then
				/**
				 * 동작 검증
				 * 버킷 조회
				 * 사진 없음
				 */
				then(bucketRepository).should().findByBucketId(data.getBucketId());
				
				/**
				 * 결과 검증
				 */
				BDDAssertions.then(result.getTitle()).isEqualTo(updatedBucket.getTitle());
				BDDAssertions.then(result.getContent()).isEqualTo(updatedBucket.getContent());
				BDDAssertions.then(result.getSecret()).isEqualTo(updatedBucket.getSecret());
				BDDAssertions.then(result.getImageUrl()).isEqualTo(updatedBucket.getImageUrl());
				
			}
			
		}
		
		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {
			
			@Test
			@DisplayName("존재하지 않는 버킷 아이디")
			void wrongBucketId() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(2L)
						.title("updated title")
						.content("updated content")
						.complete("2023-06-13")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(NotFoundException.class);
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("다른 유저의 버킷")
			void notTheAuthor() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(2L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("updated title")
						.content("updated content")
						.complete("2023-06-13")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(UnAuthorizedException.class);
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("제목 없음")
			void noTitle() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("")
						.content("updated content")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("제목이 없습니다.");
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("내용과 사진 모두 없음")
			void noContentAndPhoto() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.build();
				
				/**
				 * 수정 내역
				 * 내용과 사진 모두 없음
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("new title")
						.content("")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("내용과 사진이 모두 없습니다.");
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("버킷 달성 날짜가 오늘 이후")
			void invalidCompleteTime1() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.build();
				
				/**
				 * 수정 내역
				 * 버킷 달성 날짜가 2222년 
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("new title")
						.content("new content")
						.secret(false)
						.updatePhoto(false)
						.complete("2222-04-22")
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("버킷 완료 날짜는 오늘 이후일 수 없습니다.");
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("버킷 달성 날짜 입력되지 않음")
			void invalidCompleteTime2() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.build();
				
				/**
				 * 수정 내역
				 * 버킷 달성 날짜가 null
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("new title")
						.content("new content")
						.secret(false)
						.updatePhoto(false)
						.complete(null)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("버킷 완료 날짜를 입력해주세요.");
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
		}
		
	}
		
	@Nested
	@DisplayName("버킷 업데이트(제목)")
	class UpdateBucketTitleTest {
		
		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {
			
			@Test
			@DisplayName("제목 입력됨")
			void withTitle() throws NotFoundException, UnAuthorizedException, IllegalArgumentException {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketTitleDto data = new UpdateBucketTitleDto(1L, "new title");
				
				/**
				 * 수정된 버킷 (expected)
				 */
				Bucket updateBucket = Bucket.builder()
						.bucketId(1L)
						.title(data.getTitle())
						.userId(1L)
						.report(0)
						.build();
				
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				given(bucketRepository.save(any(Bucket.class))).willReturn(updateBucket);
				
				// when
				CreateBucketResDto result = bucketService.updateBucketTitle(data);
				
				// then
				/**
				 * 동작 검증
				 * 버킷 조회
				 */
				then(bucketRepository).should().findByBucketId(data.getBucketId());
				
				/**
				 * 결과 검증
				 */
				BDDAssertions.then(result.getTitle()).isEqualTo(updateBucket.getTitle());
				
			}
		
		}
		
		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {
			
			@Test
			@DisplayName("존재하지 않는 버킷 아이디")
			void wrongBucketId() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(2L)
						.title("updated title")
						.content("updated content")
						.complete("2023-06-14")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(NotFoundException.class);
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("다른 유저의 버킷")
			void notTheAuthor() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(2L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("updated title")
						.content("updated content")
						.complete("2023-06-14")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(UnAuthorizedException.class);
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("제목 없음")
			void noTitle() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				/**
				 * 수정 내역
				 */
				UpdateBucketDto data = UpdateBucketDto.builder()
						.bucketId(1L)
						.title("")
						.content("updated content")
						.secret(false)
						.updatePhoto(false)
						.build();
				
				given(bucketRepository.findByBucketId(data.getBucketId())).willReturn(Optional.of(existingBucket));
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.updateBucket(data, null))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("제목이 없습니다.");
				
				then(bucketRepository).should(never()).save(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
		}
		
	}
	
	@Nested
	@DisplayName("버킷 삭제")
	class DeleteBucketTest {
		
		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {
			
			@Test
			@DisplayName("본인의 버킷")
			void myBucket() throws NotFoundException, UnAuthorizedException {
				
				/**
				 * 기존 버킷
				 */
				Bucket bucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("testing.com")
						.build();
				
				Comment comment1 = Comment.builder().commentId(1L).build();
				Comment comment2 = Comment.builder().commentId(2L).build();
				List<Comment> comments = List.of(comment1, comment2);
				
				given(bucketRepository.findByBucketId(1L)).willReturn(Optional.of(bucket));
				given(commentRepository.findAllByTypeIdAndType(1L, false)).willReturn(comments);
				
				// when
				Long deleteBucketId = bucketService.deleteBucket(1L);
				
				// then
				/**
				 * 동작 검증
				 * 버킷 조회
				 * 사진 삭제
				 * 댓글 삭제
				 * 버킷 삭제
				 */
				then(bucketRepository).should().findByBucketId(1L);
				then(s3Upload).should().delete("testing.com");
				then(commentRepository).should().findAllByTypeIdAndType(1L, false);
				then(commentRepository).should().deleteAllInBatch(comments);
				then(bucketRepository).should().delete(bucket);
				
				/**
				 * 결과 검증
				 */
				BDDAssertions.then(deleteBucketId).isEqualTo(1L);
				
			}
			
		}
		
		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {
			
			@Test
			@DisplayName("존재하지 않는 버킷 아이디")
			void wrongBucketId() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(1L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.deleteBucket(2L))
						.isInstanceOf(NotFoundException.class);
				
				then(bucketRepository).should(never()).delete(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
			@Test
			@DisplayName("다른 유저의 버킷")
			void notTheAuthor() {
				
				/**
				 * 기존 버킷
				 */
				Bucket existingBucket = Bucket.builder()
						.bucketId(1L)
						.title("Test Title")
						.userId(2L)
						.content("Test Content")
						.secret(true)
						.report(0)
						.imageUrl("https://example.com/old_image.jpg")
						.build();
				
				
				given(bucketRepository.findByBucketId(1L)).willReturn(Optional.of(existingBucket));
				
				// when
				
				// then
				/**
				 * 예외처리 검증
				 */
				BDDAssertions.thenThrownBy(() -> bucketService.deleteBucket(1L))
						.isInstanceOf(UnAuthorizedException.class);
				
				then(bucketRepository).should(never()).delete(any(Bucket.class));
				then(s3Upload).shouldHaveNoInteractions();
				
			}
			
		}
		
	}

}