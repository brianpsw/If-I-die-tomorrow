package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;


import static org.assertj.core.api.Assertions.assertThat;


@DataJpaTest
class DiaryRepositoryTest {

	@Autowired
	private DiaryRepository testDiaryRepository;
	@Autowired
	private CommentRepository testCommentRepository;




	@BeforeEach
	void setUp() {

//		1번 유저 다이어리 (1, 2)
		Diary diary1 = testDiaryRepository.save(
				Diary.builder()
						.userId(1L)
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
						.userId(1L)
						.title("1-2 title")
						.content("1-2 content")
						.imageUrl("")
						.report(0)
						.secret(false)
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
						.secret(false)
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


	}

	@Test
	@DisplayName("특정 유저가 작성한 다이어리랑 댓글 개수 가져오기")
	void findAllByUserIdWithCommentCount() {
		// Given
		Long userId = 1L;

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
	@DisplayName("특정 다이어리와 작성자 닉네임 조회")
	void findByIdWithUserNickName() {

	}

	@Test
	void findAllBySecretIsFalse() {
	}
}