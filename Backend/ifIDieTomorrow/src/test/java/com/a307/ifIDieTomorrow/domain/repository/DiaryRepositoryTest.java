package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;


import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
class DiaryRepositoryTest {

	@Autowired
	private DiaryRepository testDiaryRepository;
	@Autowired
	private CommentRepository testCommentRepository;
	@Autowired
	private UserRepository testUserRepository;


	@AfterEach
	void tearDown() {
		testDiaryRepository.deleteAllInBatch();
		testUserRepository.deleteAllInBatch();
		testCommentRepository.deleteAllInBatch();
	}



	@Test
	@DisplayName("특정 유저가 작성한 다이어리랑 댓글 개수 가져오기")
	void findAllByUserIdWithCommentCount() {
		// Given
		Long userId = 1L;

		//		1번 유저 다이어리 (1, 2)
		Diary diary1 = testDiaryRepository.save(
				Diary.builder()
						.userId(userId)
						.title("1-1 title")
						.content("1-1 content")
						.imageUrl("")
						.report(0)
						.secret(true)
						.build()
		);
		System.out.println(diary1.getDiaryId());
		Diary diary2 = testDiaryRepository.save(
				Diary.builder()
						.userId(userId)
						.title("1-2 title")
						.content("1-2 content")
						.imageUrl("")
						.report(0)
						.secret(true)
						.build()
		);

//		2번 유저 다이어리 (3, 4)
		Diary diary3 = testDiaryRepository.save(
				Diary.builder()
						.userId(2L)
						.title("2-1 title")
						.content("2-1 content")
						.imageUrl("")
						.report(0)
						.secret(true)
						.build()
		);
		Diary diary4 = testDiaryRepository.save(
				Diary.builder()
						.userId(2L)
						.title("2-2 title")
						.content("2-2 content")
						.imageUrl("")
						.report(0)
						.secret(true)
						.build()
		);

//		댓글 (1번 유저 1번 게시글에 1개, 1번유저 2번 게시글에 1개)
		Comment comment1 = testCommentRepository.save(
				Comment.builder()
						.userId(3L)
						.content("comment1")
						.typeId(diary1.getDiaryId())
						.type(true)
						.build()
		);

		Comment comment2 = testCommentRepository.save(
				Comment.builder()
						.userId(3L)
						.content("comment2")
						.typeId(diary2.getDiaryId())
						.type(true)
						.build()
		);

		// When
		List<GetDiaryByUserResDto> result = testDiaryRepository.findAllByUserIdWithCommentCount(userId);

		// Then
//		다이어리 2개
		assertThat(result).hasSize(2);

//		다이어리 작성자 검증
//		해당 메서드가 작성자를 반환하지 않아 내용으로 검증했습니다.
		GetDiaryByUserResDto dto = result.get(0);
		assertThat(dto.getTitle()).isEqualTo("1-1 title");

//		댓글 1개
		assertThat(dto.getCommentCount()).isEqualTo(1L);
	}


	@Test
	@DisplayName("특정 아이디의 다이어리와 작성자 닉네임 조회")
	void findByIdWithUserNickName() {

//		given
		User user = testUserRepository.save(User.builder()
				.name("tom")
				.nickname("tommy")
				.email("tom@email.com")
				.age(23)
				.sendAgree(false)
				.newCheck(true)
				.deleted(false)
				.providerType(ProviderType.NAVER)
				.build());

		Diary diary = testDiaryRepository.save(Diary.builder()
				.userId(user.getUserId())
				.title("tom diary title")
				.content("tom content title")
				.imageUrl("")
				.secret(true)
				.report(0)
				.build());

//		when

//		해당 아이디에 속하는 다이어리 존재
		Optional<GetDiaryResDto> result = testDiaryRepository.findByIdWithUserNickName(diary.getDiaryId());
//		해당 아이디에 속하는 다이어리가 없을 경우
		Optional<GetDiaryResDto> empty = testDiaryRepository.findByIdWithUserNickName(-1L);

//		then
		assertThat(result).isPresent();
		GetDiaryResDto dto = result.get();
		assertThat(dto.getDiaryId()).isEqualTo(diary.getDiaryId());
		assertThat(dto.getNickname()).isEqualTo(user.getNickname());

		assertThat(empty).isEmpty();
	}

	@Test
	@DisplayName("공개 여부 설정된 다이어리 전체 불러오기")
	void findAllBySecretIsFalse() {

//		given
		User user = testUserRepository.save(User.builder()
				.name("tom")
				.nickname("tommy")
				.email("tom@email.com")
				.age(23)
				.sendAgree(false)
				.newCheck(true)
				.deleted(false)
				.providerType(ProviderType.NAVER)
				.build());

//		공개 다이어리(2개)
		Diary diary1 = testDiaryRepository.save(Diary.builder()
				.userId(user.getUserId())
				.title("no secret 1")
				.content("content")
				.imageUrl("")
				.secret(false)
				.report(0)
				.build());

		Diary diary2 = testDiaryRepository.save(Diary.builder()
				.userId(user.getUserId())
				.title("no secret 2")
				.content("content")
				.imageUrl("")
				.secret(false)
				.report(0)
				.build());

//		비공개 다이어리(1개)
		Diary diary3 = testDiaryRepository.save(Diary.builder()
				.userId(user.getUserId())
				.title("secret 1")
				.content("content")
				.imageUrl("")
				.secret(true)
				.report(0)
				.build());

//		when
		Page<GetDiaryResDto> result = testDiaryRepository.findAllBySecretIsFalse(PageRequest.of(0, 10));

//		then
		assertThat(result)
				.hasSize(2)
				.allSatisfy(dto -> {
					assertThat(dto.getSecret()).isEqualTo(false);
					assertThat(dto.getNickname()).isEqualTo("tommy");
				});

	}
}