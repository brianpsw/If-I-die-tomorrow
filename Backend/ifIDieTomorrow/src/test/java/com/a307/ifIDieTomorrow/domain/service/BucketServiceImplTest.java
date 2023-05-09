package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.CreateBucketWithTitleDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
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
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

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
			@DisplayName("버킷 제목 생성")
			void createBucketWithTitle() {

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

	}

}