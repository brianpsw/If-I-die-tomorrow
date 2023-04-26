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

import static org.mockito.BDDMockito.given;


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
	@DisplayName("정상적으로 다이어리 생성되는 경우")
	void createDiary() throws IOException, IllegalArgumentException, NoPhotoException {

		// given

		CreateDiaryReqDto req = new CreateDiaryReqDto("Test Title", "Test Content", true, true);
		MockMultipartFile photo = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test".getBytes());

		Diary diary = Diary.builder()
				.title(req.getTitle())
				.userId(1L)
				.content(req.getContent())
				.secret(req.getSecret())
				.imageUrl("https://example.com/test.jpg")
				.build();

		Diary savedDiary = Diary.builder()
				.diaryId(1L)
				.title(req.getTitle())
				.userId(1L)
				.content(req.getContent())
				.secret(req.getSecret())
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

//
		given(diaryRepository.save(diary)).willReturn(savedDiary);
		given(s3Upload.uploadFiles(photo, "diary")).willReturn("https://example.com/test.jpg");

//		테스트용 유저 인증
		TestingAuthenticationToken authentication = new TestingAuthenticationToken(UserPrincipal.create(user), null);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		// when
		CreateDiaryResDto result = diaryService.createDiary(req, photo);

		// then
		ArgumentCaptor<Diary> diaryCaptor = ArgumentCaptor.forClass(Diary.class);



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