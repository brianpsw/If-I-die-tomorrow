package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import org.assertj.core.api.BDDAssertions;
import org.junit.Ignore;
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
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;


@ExtendWith(MockitoExtension.class)
class DiaryServiceImplTest {

	@InjectMocks
	private DiaryServiceImpl diaryService;
	@Mock
	private DiaryRepository diaryRepository;
	@Mock
	private S3Upload s3Upload;
	@Mock
	private CommentRepository commentRepository;

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
				.age(23)
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
		diaryRepository.deleteAllInBatch();
	}

	@Test
	@DisplayName("정상적으로 다이어리 생성되는 경우(이미지 o)")
	void createDiaryWithPhoto() throws IOException, IllegalArgumentException, NoPhotoException {

		// given
		CreateDiaryReqDto req = new CreateDiaryReqDto("Test Title", "Test Content", true, true);
		MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());

		Diary savedDiary = Diary.builder()
				.diaryId(1L)
				.title(req.getTitle())
				.userId(1L)
				.content(req.getContent())
				.secret(req.getSecret())
				.report(0)
				.imageUrl("https://example.com/test.jpg")
				.build();

		/**
		 * 정상 동작 stubbing
		 */
		given(diaryRepository.save(any(Diary.class))).willReturn(savedDiary);
		given(s3Upload.uploadFiles(photo, "diary")).willReturn("https://example.com/test.jpg");

		// when
		CreateDiaryResDto result = diaryService.createDiary(req, photo);
		ArgumentCaptor<Diary> diaryCaptor = ArgumentCaptor.forClass(Diary.class);

		// then
		/**
		 * 동작 검증
		 * 사진 업로드가 되는가
		 * 다이어리가 저장 되는가
		 */
		then(s3Upload).should().uploadFiles(photo, "diary");
		then(diaryRepository).should().save(diaryCaptor.capture());

		/**
		 * 전달된 인자 검증
		 * 유저 아이디가 정상적으로 들어갔는가
		 * 이미지가 정상적으로 업로드 되었는가
		 */
		Diary capturedDiary = diaryCaptor.getValue();
		BDDAssertions.then(capturedDiary.getUserId()).isEqualTo(1L);
		BDDAssertions.then(capturedDiary.getImageUrl()).isEqualTo("https://example.com/test.jpg");

		/**
		 * 결괏값 검증
		 * 다이어리 아이디
		 * 유저아이디
		 * 이미지
		 */
		BDDAssertions.then(result.getDiaryId()).isEqualTo(savedDiary.getDiaryId());
		BDDAssertions.then(result.getUserId()).isEqualTo(savedDiary.getUserId());
		BDDAssertions.then(result.getImageUrl()).isEqualTo(savedDiary.getImageUrl());
	}

	@Test
	@DisplayName("정상적으로 다이어리 생성되는 경우(이미지 x)")
	void createDiaryWithOutPhoto() throws IOException, IllegalArgumentException, NoPhotoException {

		// given

		CreateDiaryReqDto req = new CreateDiaryReqDto("Test Title", "Test Content", true, false);

		Diary savedDiary = Diary.builder()
				.diaryId(1L)
				.title(req.getTitle())
				.userId(1L)
				.content(req.getContent())
				.secret(req.getSecret())
				.report(0)
				.imageUrl("")
				.build();


		/**
		 * 정상 동작 stubbing
		 */
		given(diaryRepository.save(any(Diary.class))).willReturn(savedDiary);


		// when
		CreateDiaryResDto result = diaryService.createDiary(req, null);
		ArgumentCaptor<Diary> diaryCaptor = ArgumentCaptor.forClass(Diary.class);

		// then
		/**
		 * 동작 검증
		 * 사진이 업로드 되지 않는다
		 * 다이어리가 저장 되는가
		 */
		then(s3Upload).shouldHaveNoInteractions();
		then(diaryRepository).should().save(diaryCaptor.capture());

		/**
		 * 전달된 인자 검증
		 * 유저 아이디가 정상적으로 들어갔는가
		 * 이미지가 ""로 넘어가는가
		 */
		Diary capturedDiary = diaryCaptor.getValue();
		BDDAssertions.then(capturedDiary.getUserId()).isEqualTo(1L);
		BDDAssertions.then(capturedDiary.getImageUrl()).isEqualTo("");

		/**
		 * 결괏값 검증
		 * 다이어리 아이디
		 * 유저아이디
		 * 이미지
		 */
		BDDAssertions.then(result.getDiaryId()).isEqualTo(savedDiary.getDiaryId());
		BDDAssertions.then(result.getUserId()).isEqualTo(savedDiary.getUserId());
		BDDAssertions.then(result.getImageUrl()).isEqualTo(savedDiary.getImageUrl());
	}



	@Test
	@DisplayName("다이어리 생성 시 사진 누락됐을 경우 예외처리")
	void createDiaryThrowsExceptionWhenNoPhoto() {

		// given
		CreateDiaryReqDto req = new CreateDiaryReqDto("Test Title", "Test Content", true, true);

		// when

		// then
		/**
		 * 예외처리 검증
		 */
		BDDAssertions.thenThrownBy(() -> diaryService.createDiary(req, null))
				.isInstanceOf(NoPhotoException.class)
				.hasMessage("올리고자 하는 사진이 없습니다");

		/**
		 * 동작 검증
		 * 사진을 업로드하거나 다이어리를 저장하지 않는다.
		 */
		then(diaryRepository).shouldHaveNoInteractions();
		then(s3Upload).shouldHaveNoInteractions();

	}

	@Test
	@DisplayName("유저가 작성한 다이러리 목록 가져오기")
	void getDiaryByUserId() {

		// given
		List<GetDiaryByUserResDto> expected = Arrays.asList(
				new GetDiaryByUserResDto(1L, "Title 1", "Content 1", "imageUrl1", true, LocalDateTime.now(), LocalDateTime.now(), 1L),
				new GetDiaryByUserResDto(2L, "Title 2", "Content 2", "imageUrl2", false, LocalDateTime.now(), LocalDateTime.now(), 2L)
		);


		given(diaryRepository.findAllByUserIdWithCommentCount(user.getUserId())).willReturn(expected);

		// when
		List<GetDiaryByUserResDto> result = diaryService.getDiaryByUserId();

		// then
		BDDAssertions.then(result).isEqualTo(expected);
	}

	@Test
	@DisplayName("다이어리 아이디로 다이어리 조회 성공")
	void getDiaryById() throws NotFoundException {

		// given
		Long diaryId = 1L;
		GetDiaryResDto diaryDto = new GetDiaryResDto(1L, 1L, "userNickname", "diaryTitle", "imageUrl", "diaryContent", true, LocalDateTime.now(), LocalDateTime.now());
		List<GetCommentResDto> comments = List.of(
				new GetCommentResDto(1L, "Test Comment 1", 2L, "user 2 nickname", LocalDateTime.now(), LocalDateTime.now()),
				new GetCommentResDto(2L, "Test Comment 2", 3L, "user 3 nickname", LocalDateTime.now(), LocalDateTime.now())
		);

		given(diaryRepository.findByIdWithUserNickName(diaryId)).willReturn(Optional.of(diaryDto));
		given(commentRepository.findCommentsByTypeId(diaryId, true)).willReturn(comments);

		// when
		HashMap<String, Object> result = diaryService.getDiaryById(diaryId);

		// then
		/**
		 * 결괏값 검증
		 * 다이어리 일치 여부
		 * 댓글 일치 여부
		 */
		BDDAssertions.then(result.get("diary")).isEqualTo(diaryDto);
		BDDAssertions.then(result.get("comments")).isEqualTo(comments);
		/**
		 * 동작 검증
		 * 다이어리 조회
		 * 댓글 조회
		 */
		then(diaryRepository).should().findByIdWithUserNickName(diaryId);
		then(commentRepository).should().findCommentsByTypeId(diaryId, true);
	}

	@Test
	@DisplayName("다이어리 아이디가 없을 경우 다이어리 조회 예외처리")
	void getDiaryByIdThrowsExceptionWhenWrongDiaryId(){

		// given
		Long diaryId = 1L;
		given(diaryRepository.findByIdWithUserNickName(diaryId)).willReturn(Optional.empty());

		// when

		// then
		/**
		 * 예외처리 검증
		 */
		BDDAssertions.thenThrownBy(() -> diaryService.getDiaryById(1L))
				.isInstanceOf(NotFoundException.class)
				.hasMessage("잘못된 다이어리 아이디입니다!");

		/**
		 * 동작 검증
		 * 다이어리 조회를 한다
		 * 댓글 조회를 하지 않는다(예외 발생)
		 */
		then(diaryRepository).should().findByIdWithUserNickName(diaryId);
		then(commentRepository).shouldHaveNoInteractions();

	}

	@Test
	@DisplayName("사진이 있는 다이어리 삭제 성공")
	void deleteDiaryByDiaryIdWithImageUrl() throws NotFoundException {
		// given
		Long diaryId = 1L;
		String imageUrl = "https://example.com/test.jpg";
		Diary diary = Diary.builder()
				.diaryId(diaryId)
				.title("title")
				.userId(user.getUserId())
				.content("content")
				.secret(true)
				.report(0)
				.imageUrl(imageUrl)
				.build();

		Comment comment1 = Comment.builder().commentId(1L).build();
		Comment comment2 = Comment.builder().commentId(2L).build();
		List<Comment> comments = List.of(comment1, comment2);

		given(diaryRepository.findById(diaryId)).willReturn(Optional.of(diary));
		given(commentRepository.findAllByTypeIdAndType(diaryId, true)).willReturn(comments);

		// when
		Long deletedDiaryId = diaryService.deleteDiaryByDiaryId(diaryId);

		// then
		/**
		 * 동작 검증
		 * 다이어리 조회
		 * 파일 삭제
		 * 댓글 조회
		 * 댓글 삭제
		 * 다이어리 삭제
		 */
		then(diaryRepository).should().findById(diaryId);
		then(s3Upload).should().fileDelete(imageUrl);
		then(commentRepository).should().findAllByTypeIdAndType(diaryId, true);
		then(commentRepository).should().deleteAllInBatch(comments);
		then(diaryRepository).should().delete(diary);


	}

	@Test
	@DisplayName("사진이 없는 다이어리 삭제 성공")
	void deleteDiaryByDiaryIdWithNoImageUrl() throws NotFoundException {
		// given
		Long diaryId = 1L;
		String imageUrl = "";
		Diary diary = Diary.builder()
				.diaryId(diaryId)
				.title("title")
				.userId(user.getUserId())
				.content("content")
				.secret(true)
				.report(0)
				.imageUrl(imageUrl)
				.build();

		Comment comment1 = Comment.builder().commentId(1L).build();
		Comment comment2 = Comment.builder().commentId(2L).build();
		List<Comment> comments = List.of(comment1, comment2);

		given(diaryRepository.findById(diaryId)).willReturn(Optional.of(diary));
		given(commentRepository.findAllByTypeIdAndType(diaryId, true)).willReturn(comments);

		// when
		Long deletedDiaryId = diaryService.deleteDiaryByDiaryId(diaryId);

		// then
		/**
		 * 동작 검증
		 * 다이어리 조회
		 * 파일 삭제 안 함
		 * 댓글 조회
		 * 댓글 삭제
		 * 다이어리 삭제
		 */
		then(diaryRepository).should().findById(diaryId);
		then(s3Upload).shouldHaveNoInteractions();
		then(commentRepository).should().findAllByTypeIdAndType(diaryId, true);
		then(commentRepository).should().deleteAllInBatch(comments);
		then(diaryRepository).should().delete(diary);
	}

	@Test
	@DisplayName("다이어리 삭제 실패 예외 처리")
	void deleteDiaryByDiaryIdThrowsExceptionWhenWrongDiaryId() {
		// given
		Long diaryId = 1L;
		given(diaryRepository.findById(diaryId)).willReturn(Optional.empty());

		// when

		// then
		BDDAssertions.thenThrownBy(() -> diaryService.deleteDiaryByDiaryId(diaryId))
				.isInstanceOf(NotFoundException.class)
				.hasMessage("잘못된 다이어리 아이디입니다!");

		then(diaryRepository).should().findById(diaryId);
		then(s3Upload).shouldHaveNoInteractions();
		then(commentRepository).shouldHaveNoInteractions();
	}

	@Test
	@Ignore
	void updateDiary() {
	}
}