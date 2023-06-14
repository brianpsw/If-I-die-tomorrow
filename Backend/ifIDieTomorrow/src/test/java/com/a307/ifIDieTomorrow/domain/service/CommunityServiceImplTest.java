package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.comment.UpdateCommentReqDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetBucketWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetDiaryWithCommentDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.AdminUtil;
import com.google.firebase.messaging.FirebaseMessagingException;
import org.assertj.core.api.BDDAssertions;
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
import java.util.*;

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
	private UserRepository userRepository;
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
				then(commentRepository).shouldHaveNoInteractions();

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

			@Test
			@DisplayName("공개된 다이어리랑 댓글 가져오기")
			void getDiaryWithComments() {

				// Given
				int pageNo = 0;
				int pageSize = 10;

//				페이지 요청
				PageRequest pageable = PageRequest.of(pageNo, pageSize);

//				다이어리 1
				GetDiaryResDto diaryResDto1 = GetDiaryResDto.builder()
						.diaryId(1L)
						.userId(1L)
						.nickname("TestUser1")
						.title("TestBucketTitle1")
						.content("TestBucketContent1")
						.imageUrl("")
						.secret(false)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

//				다이어리 2
				GetDiaryResDto diaryResDto2 = GetDiaryResDto.builder()
						.diaryId(2L)
						.userId(2L)
						.nickname("TestUser2")
						.title("TestBucketTitle2")
						.content("TestBucketContent2")
						.imageUrl("")
						.secret(false)
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

//				다이어리 1의 댓글
				GetCommentResDto commentResDto = GetCommentResDto.builder()
						.commentId(1L)
						.content("TestCommentContent")
						.userId(1L)
						.nickname("TestUser1")
						.createdAt(LocalDateTime.now())
						.updatedAt(LocalDateTime.now())
						.build();

				List<GetCommentResDto> commentResDtoList = Collections.singletonList(commentResDto);

//				다이어리 1 + 댓글
				GetDiaryWithCommentDto diaryWithCommentDto1 = GetDiaryWithCommentDto.builder()
						.diary(diaryResDto1)
						.comments(commentResDtoList)
						.build();

//				다이어리 2 + 댓글 없음
				GetDiaryWithCommentDto diaryWithCommentDto2 = GetDiaryWithCommentDto.builder()
						.diary(diaryResDto2)
						.comments(Collections.emptyList())
						.build();

//				예상 결괏값
				PageImpl<GetDiaryResDto> pageResponse = new PageImpl<>(Arrays.asList(diaryResDto1, diaryResDto2));
				List<GetDiaryWithCommentDto> diaryWithCommentsList = Arrays.asList(diaryWithCommentDto1, diaryWithCommentDto2);

				given(diaryRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT)).willReturn(pageResponse);
				given(commentRepository.findCommentsByTypeId(1L, true)).willReturn(commentResDtoList);
				given(commentRepository.findCommentsByTypeId(2L, true)).willReturn(Collections.emptyList());


				// When
				GetPageDto result = communityService.getDiaryWithComments(pageNo, pageSize);


				// Then
				/**
				 * 게시글 조회
				 * 게시글 당 댓글 조회
				 */
				then(diaryRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);
				then(commentRepository).should(times(diaryWithCommentsList.size())).findCommentsByTypeId(anyLong(), eq(true));

				/**
				 * 결괏값 검증
				 * 페이징 검증
				 */
				assertThat(result.getData()).isEqualTo(diaryWithCommentsList);
				assertThat(result.getHasNext()).isEqualTo(pageResponse.hasNext());
			}

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

			@Test
			@DisplayName("해당하는 다이어리 게시글이 없을 때 빈 리스트 반환")
			void checkWhenNoDiary() {
				// Given
				Integer pageNo = 0;
				Integer pageSize = 10;
				PageRequest pageable = PageRequest.of(pageNo, pageSize);

//				레포지토리에서 다이어리 조회 시 빈 페이지 반환
				Page<GetDiaryResDto> pageResponse = new PageImpl<>(Collections.emptyList());
				given(diaryRepository.findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT)).willReturn(pageResponse);

				// When
				GetPageDto result = communityService.getDiaryWithComments(pageNo, pageSize);

				// Then
				/**
				 * 다이어리 조회
				 * 댓글 조회 x
				 */
				then(diaryRepository).should().findAllBySecretIsFalseAndReportUnderLimit(pageable, adminUtil.MAX_REPORT);
				then(commentRepository).shouldHaveNoInteractions();

				/**
				 * 빈 리스트 반환
				 * 다음 페이지 x
				 */
				assertThat(result.getData()).isEqualTo(Collections.emptyList());
				assertThat(result.getHasNext()).isFalse();
			}

		}

	}

	@Nested
	@DisplayName("댓글 생성")
	class CreateCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

			@Test
			@DisplayName("다이어리에 댓글 생성")
			void createCommentForDiary() throws NotFoundException, IllegalArgumentException, FirebaseMessagingException {

				// Given
				CreateCommentReqDto req = CreateCommentReqDto.builder()
						.content("Test content")
						.type(true)
						.typeId(1L)
						.build();

				Diary diary = Diary.builder()
						.diaryId(req.getTypeId())
						.title("Test")
						.content("Test content")
						.userId(1L)
						.secret(false)
						.report(0)
						.imageType(null)
						.imageUrl(null)
						.build();

				Comment comment = Comment.builder()
						.commentId(1L)
						.content(req.getContent())
						.userId(1L)
						.type(req.getType())
						.typeId(req.getTypeId())
						.build();

				ArgumentCaptor<Comment> commentCaptor = ArgumentCaptor.forClass(Comment.class);

				given(diaryRepository.existsById(req.getTypeId())).willReturn(true);
				given(commentRepository.save(any(Comment.class))).willReturn(comment);
				given(userRepository.findUserNickNameByUserId(comment.getUserId())).willReturn(user.getNickname());
				given(diaryRepository.findById(req.getTypeId())).willReturn(Optional.ofNullable(diary));

				// When
				CreateCommentResDto res = communityService.createComment(req);

				// Then
				then(commentRepository).should().save(commentCaptor.capture());

				assertThat(user.getUserId()).isEqualTo(commentCaptor.getValue().getUserId());
				assertThat(req.getContent()).isEqualTo(commentCaptor.getValue().getContent());
				assertThat(res.getCommentId()).isEqualTo(comment.getCommentId());
				assertThat(res.getNickname()).isEqualTo(user.getNickname());

			}

			@Test
			@DisplayName("버킷에 댓글 생성")
			void createCommentForBucket() throws NotFoundException, IllegalArgumentException, FirebaseMessagingException {

				// Given
				CreateCommentReqDto req = CreateCommentReqDto.builder()
						.content("Test content")
						.type(false)
						.typeId(1L)
						.build();

				Comment comment = Comment.builder()
						.commentId(1L)
						.content(req.getContent())
						.userId(1L)
						.type(req.getType())
						.typeId(req.getTypeId())
						.build();

				Bucket bucket = Bucket.builder()
						.bucketId(1L)
						.userId(1L)
						.secret(false)
						.report(0)
						.imageType(null)
						.imageUrl(null)
						.complete("2023-05-08")
						.content("Test Content")
						.title("Test")
						.build();

				ArgumentCaptor<Comment> commentCaptor = ArgumentCaptor.forClass(Comment.class);

				given(bucketRepository.existsById(req.getTypeId())).willReturn(true);
				given(commentRepository.save(any(Comment.class))).willReturn(comment);
				given(userRepository.findUserNickNameByUserId(comment.getUserId())).willReturn(user.getNickname());
				given(bucketRepository.findByBucketId(req.getTypeId())).willReturn(Optional.of(bucket));

				// When
				CreateCommentResDto res = communityService.createComment(req);

				// Then
				then(commentRepository).should().save(commentCaptor.capture());

				assertThat(user.getUserId()).isEqualTo(commentCaptor.getValue().getUserId());
				assertThat(req.getContent()).isEqualTo(commentCaptor.getValue().getContent());
				assertThat(res.getCommentId()).isEqualTo(comment.getCommentId());
				assertThat(res.getNickname()).isEqualTo(user.getNickname());

			}

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

			@Test
			@DisplayName("존재하지 않는 게시글에 댓글 생성 시 예외처리")
			void throwsExceptionWhenArticleDoesntExist(){

				// Given
				CreateCommentReqDto req = CreateCommentReqDto.builder()
						.content("Test content")
						.type(true)
						.typeId(1L)
						.build();

				given(diaryRepository.existsById(req.getTypeId())).willReturn(false);

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.createComment(req))
						.isInstanceOf(NotFoundException.class)
						.hasMessage("존재하지 않는 게시글입니다.");

				then(commentRepository).shouldHaveNoInteractions();
			}

			@Test
			@DisplayName("빈 댓글 작성 시 예외처리")
			void throwsExceptionWhenEmptyComment() {

				// Given
				CreateCommentReqDto req = CreateCommentReqDto.builder()
						.content("")
						.type(true)
						.typeId(1L)
						.build();

				given(diaryRepository.existsById(req.getTypeId())).willReturn(true);

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.createComment(req))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("내용이 없습니다.");

				then(commentRepository).shouldHaveNoInteractions();

			}


		}

	}

	@Nested
	@DisplayName("댓글 삭제")
	class DeleteCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

			@Test
			@DisplayName("댓글 정상적으로 삭제")
			void deleteComment() throws NotFoundException, UnAuthorizedException {
				// Given
				Long commentId = 1L;

				Comment comment = Comment.builder()
						.commentId(commentId)
						.userId(user.getUserId())
						.build();

				given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));

				// When
				Long deletedCommentId = communityService.deleteComment(commentId);

				// Then
				then(commentRepository).should().delete(any(Comment.class));
				assertThat(deletedCommentId).isEqualTo(commentId);
			}


		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

			@Test
			@DisplayName("내가 작성하지 않은 댓글 삭제 시 예외처리")
			void throwsExceptionWhenNotMyComment() {
				// Given
				Long commentId = 1L;
				Long anotherUserId = 2L;

				Comment comment = Comment.builder()
						.commentId(commentId)
						.content("comment content")
						.userId(anotherUserId)
						.build();

				given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.deleteComment(commentId))
						.isInstanceOf(UnAuthorizedException.class)
						.hasMessage("내가 작성한 댓글이 아닙니다.");
				then(commentRepository).should(never()).delete(any(Comment.class));

			}

			@Test
			@DisplayName("존재하지 않는 댓글 삭제 시 예외처리")
			void throwsExceptionWhenWrongCommentId() {

				// Given
				Long commentId = 1L;

				given(commentRepository.findById(commentId)).willReturn(Optional.empty());

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.deleteComment(commentId))
						.isInstanceOf(NotFoundException.class)
						.hasMessage("잘못된 댓글 아이디입니다.");
				then(commentRepository).should(never()).delete(any(Comment.class));
			}
		}

	}

	@Nested
	@DisplayName("댓글 수정")
	class UpdateCommentTest {

		@Nested
		@DisplayName("성공 케이스")
		class NormalScenario {

			@Test
			@DisplayName("정상적으로 댓글 수정")
			void updateComment() throws NotFoundException, UnAuthorizedException, IllegalArgumentException {

				// Given
				Long commentId = 1L;


				Comment comment = Comment.builder()
						.commentId(commentId)
						.userId(user.getUserId())
						.content("Old content")
						.build();

				UpdateCommentReqDto req = UpdateCommentReqDto.builder()
						.commentId(commentId)
						.content("New Content")
						.build();

				Comment updatedComment = Comment.builder()
						.commentId(commentId)
						.userId(user.getUserId())
						.content("New Content")
						.build();


				given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));
				given(userRepository.findById(user.getUserId())).willReturn(Optional.of(user));
				given(commentRepository.save(any(Comment.class))).willReturn(updatedComment);

				// When
				CreateCommentResDto result = communityService.updateComment(req);

				// Then
				then(commentRepository).should().save(any(Comment.class));

				assertThat(result.getContent()).isEqualTo("New Content");

			}

		}

		@Nested
		@DisplayName("예외 케이스")
		class ExceptionScenario {

			@Test
			@DisplayName("존재하지 않는 댓글 수정 시 예외처리")
			void ThrowsExceptionWhenWrongCommentId() {
				// Given
				Long commentId = 1L;
				Long WrongId = 2L;

				Comment comment = Comment.builder()
						.commentId(commentId)
						.userId(user.getUserId())
						.content("Old content")
						.build();

				UpdateCommentReqDto req = UpdateCommentReqDto.builder()
						.commentId(WrongId)
						.content("New Content")
						.build();

				given(commentRepository.findById(WrongId)).willReturn(Optional.empty());

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.updateComment(req))
						.isInstanceOf(NotFoundException.class)
						.hasMessage("잘못된 댓글 아이디입니다.");

				then(commentRepository).should(never()).save(any(Comment.class));
			}

			@Test
			@DisplayName("내가 작성하지 않은 댓글 수정 시 예외처리")
			void ThrowsExceptionWhenNotMyComment() {
				// Given
				Long commentId = 1L;
				Long anotherUserId = 2L;

				Comment comment = Comment.builder()
						.commentId(commentId)
						.userId(anotherUserId)
						.content("Old content")
						.build();

				UpdateCommentReqDto req = UpdateCommentReqDto.builder()
						.commentId(commentId)
						.content("New Content")
						.build();

				given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));
				given(userRepository.findById(user.getUserId())).willReturn(Optional.of(user));

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.updateComment(req))
						.isInstanceOf(UnAuthorizedException.class)
						.hasMessage("내가 작성한 댓글이 아닙니다");

				then(commentRepository).should(never()).save(any(Comment.class));
			}

			@Test
			@DisplayName("빈 댓글 작성 시 예외처리")
			void throwsExceptionWhenEmptyComment() {

				// Given
				Long commentId = 1L;

				Comment comment = Comment.builder()
						.commentId(commentId)
						.userId(user.getUserId())
						.content("Old content")
						.build();

				UpdateCommentReqDto req = UpdateCommentReqDto.builder()
						.commentId(commentId)
						.content("")
						.build();

				given(commentRepository.findById(commentId)).willReturn(Optional.of(comment));

				// When & Then
				BDDAssertions.thenThrownBy(() -> communityService.updateComment(req))
						.isInstanceOf(IllegalArgumentException.class)
						.hasMessage("내용이 없습니다.");

				then(commentRepository).should(never()).save(any(Comment.class));

			}


		}

	}

}