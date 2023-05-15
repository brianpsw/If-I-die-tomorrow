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
import org.mockito.BDDMockito.*;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
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
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;
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

				PageRequest pageable = PageRequest.of(pageNo, pageSize);

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

				GetCommentResDto commentResDto = GetCommentResDto.builder()
						.commentId(1L)
						.content("TestCommentContent")
							.userId(1L)
						.nickname("TestUser")
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

				List<GetCommentResDto> commentResDtoList = Collections.singletonList(commentResDto);

				GetBucketWithCommentDto bucketWithCommentDto1 = GetBucketWithCommentDto.builder()
						.bucket(bucketResDto1)
						.comments(commentResDtoList)
						.build();

				GetBucketWithCommentDto bucketWithCommentDto2 = GetBucketWithCommentDto.builder()
						.bucket(bucketResDto2)
						.comments(new ArrayList<>())
						.build();

				List<GetBucketWithCommentDto> bucketWithCommentList = Arrays.asList(bucketWithCommentDto1, bucketWithCommentDto2);
				Page<GetBucketResDto> pageResponse = new PageImpl<>(Arrays.asList(bucketResDto1, bucketResDto2));

				given(bucketRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT)).willReturn(pageResponse);
				given(commentRepository.findCommentsByTypeId(1L, false)).willReturn(commentResDtoList);
				given(commentRepository.findCommentsByTypeId(2L, false)).willReturn(new ArrayList<>());


				// When
				GetPageDto result = communityService.getBucketWithComments(pageNo, pageSize);


				// Then
				then(bucketRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);
				then(commentRepository).should(times(2)).findCommentsByTypeId(anyLong(), anyBoolean());

				assertThat(result.getData()).isEqualTo(bucketWithCommentList);
				assertThat(result.getHasNext()).isEqualTo(pageResponse.hasNext());



			}
		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

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