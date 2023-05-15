package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.util.AdminUtil;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.*;
import static org.mockito.Mockito.times;

@ExtendWith(MockitoExtension.class)
class CommunityServiceImplTest {

	@InjectMocks
	private CommunityServiceImpl communityService;
	@Mock
	private BucketRepository bucketRepository;
	@Mock
	private DiaryRepository diaryRepository;
	@Mock
	private CommentRepository commentRepository;
	@Mock
	private AdminUtil adminUtil;
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
		bucketRepository.deleteAllInBatch();
		diaryRepository.deleteAllInBatch();
		commentRepository.deleteAllInBatch();
	}

	@Nested
	@DisplayName("버킷 가져오기")
	class GetBucketWithCommentsTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

			@Test
			@DisplayName("공개된 버킷이랑 댓글 가져오기")
			void getBucketWithComments() {

				// Given
				int pageNo = 0;
				int pageSize = 10;

//				페이지 요청
				PageRequest pageable = PageRequest.of(pageNo, pageSize);

//				버킷 1
				GetBucketResDto bucketResDto1 = GetBucketResDto.builder()
						.bucketId(1L)
						.userId(1L)
						.nickname("TestUser1")
						.title("TestBucketTitle1")
						.content("TestBucketContent1")
						.complete("TestImageUrl1")
						.secret(false)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

//				버킷 2
				GetBucketResDto bucketResDto2 = GetBucketResDto.builder()
						.bucketId(2L)
						.userId(2L)
						.nickname("TestUser2")
						.title("TestBucketTitle2")
						.content("TestBucketContent2")
						.complete("TestImageUrl2")
						.secret(false)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

//				버킷1의 댓글
				GetCommentResDto commentResDto = GetCommentResDto.builder()
						.commentId(1L)
						.content("TestCommentContent")
							.userId(1L)
						.nickname("TestUser")
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

				List<GetCommentResDto> commentResDtoList = Collections.singletonList(commentResDto);

//				버킷 1 + 댓글
				GetBucketWithCommentDto bucketWithCommentDto1 = GetBucketWithCommentDto.builder()
						.bucket(bucketResDto1)
						.comments(commentResDtoList)
						.build();

//				버킷 2 + 댓글 없음
				GetBucketWithCommentDto bucketWithCommentDto2 = GetBucketWithCommentDto.builder()
						.bucket(bucketResDto2)
						.comments(new ArrayList<>())
						.build();

//				예상 결괏값
				List<GetBucketWithCommentDto> bucketWithCommentList = Arrays.asList(bucketWithCommentDto1, bucketWithCommentDto2);
				Page<GetBucketResDto> pageResponse = new PageImpl<>(Arrays.asList(bucketResDto1, bucketResDto2));

				given(bucketRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT)).willReturn(pageResponse);
				given(commentRepository.findCommentsByTypeId(1L, false)).willReturn(commentResDtoList);
				given(commentRepository.findCommentsByTypeId(2L, false)).willReturn(new ArrayList<>());


				// When
				GetPageDto result = communityService.getBucketWithComments(pageNo, pageSize);


				// Then
				/**
				 * 게시글 조회
				 * 게시글 당 댓글 조회
				 */
				then(bucketRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);
				then(commentRepository).should(times(bucketWithCommentList.size())).findCommentsByTypeId(anyLong(), anyBoolean());

				/**
				 * 결괏값 검증
				 * 페이징 검증
				 */
				assertThat(result.getData()).isEqualTo(bucketWithCommentList);
				assertThat(result.getHasNext()).isEqualTo(pageResponse.hasNext());
			}

			@Test
			@DisplayName("페이징 요청 안 보낼 때 기본 값 넣어서 작동되는지 검증")
			void checkDefaultPaging() {

				// Given

//				페이징 인자 캡처
				ArgumentCaptor<PageRequest> pageableCaptor = ArgumentCaptor.forClass(PageRequest.class);

//				mock 페이징 객체
				PageImpl<GetBucketResDto> pageResponse = new PageImpl<>(Collections.emptyList());
				given(bucketRepository.findAllBySecretIsFalseAndReportUnderLimit(any(PageRequest.class), eq(adminUtil.MAX_REPORT))).willReturn(pageResponse);

				// When
				communityService.getBucketWithComments(null, null);

				// Then
				/**
				 * 기본값 0, 10이 들어가는지 검증
				 */
				then(bucketRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageableCaptor.capture(), eq(adminUtil.MAX_REPORT));

				PageRequest pageRequest = pageableCaptor.getValue();
				assertThat(pageRequest.getPageNumber()).isEqualTo(0);
				assertThat(pageRequest.getPageSize()).isEqualTo(10);

			}

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

			@Test
			@DisplayName("해당하는 버킷 게시글이 없을 때 빈 리스트 반환")
			void checkWhenNoBuckets() {
				// Given
				Integer pageNo = 0;
				Integer pageSize = 10;
				PageRequest pageable = PageRequest.of(pageNo, pageSize);

				Page<GetBucketResDto> pageResponse = new PageImpl<>(Collections.emptyList());
				given(bucketRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT)).willReturn(pageResponse);

				// When
				GetPageDto result = communityService.getBucketWithComments(pageNo, pageSize);

				// Then
				then(bucketRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);

				// Assertions
				assertThat(result.getData()).isEqualTo(Collections.emptyList());
				assertThat(result.getHasNext()).isFalse();
			}

		}

	}

	@Nested
	@DisplayName("다이어리 가져오기")
	class GetDiaryWithCommentsTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

		}

	}

	@Nested
	@DisplayName("댓글 생성")
	class CreateCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

		}

	}

	@Nested
	@DisplayName("댓글 삭제")
	class DeleteCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

		}

	}

	@Nested
	@DisplayName("댓글 수정")
	class UpdateCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

		}

	}

}