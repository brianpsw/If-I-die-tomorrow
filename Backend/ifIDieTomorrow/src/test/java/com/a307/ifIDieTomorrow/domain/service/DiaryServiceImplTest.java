package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import org.assertj.core.api.BDDAssertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
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


@ExtendWith(MockitoExtension.class)
class DiaryServiceImplTest {

	@InjectMocks
	private DiaryServiceImpl diaryService;
	@Mock
	private DiaryRepository diaryRepository;
	@Mock
	private S3Upload s3Upload;

	@AfterEach
	void tearDown() {
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

		User user = User.builder()
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

		/**
		 * 정상 동작 stubbing
		 */
		given(diaryRepository.save(any(Diary.class))).willReturn(savedDiary);
		given(s3Upload.uploadFiles(photo, "diary")).willReturn("https://example.com/test.jpg");

		/**
		 * 테스트용 유저 인증객체 생성
		 */
		TestingAuthenticationToken authentication = new TestingAuthenticationToken(UserPrincipal.create(user), null);
		SecurityContextHolder.getContext().setAuthentication(authentication);

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
	@DisplayName("다이어리 생성 시 사진 없어서 에러 발생")
	void createDiaryThrowsExceptionWhenNoPhoto() {

	}

	@Test
	void getDiaryByUserId() {
	}

	@Test
	void getDiaryById() {
	}

	@Test
	void deleteDiaryByDiaryId() {
	}

	@Test
	void updateDiary() {
	}
}