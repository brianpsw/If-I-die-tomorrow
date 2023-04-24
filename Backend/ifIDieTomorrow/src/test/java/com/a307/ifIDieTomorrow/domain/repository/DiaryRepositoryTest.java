package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest
class DiaryRepositoryTest {

	@Autowired
	private DiaryRepository testDiaryRepository;
	@Autowired
	private CommentRepository testCommentRepository;

	@Test
	@DisplayName("해당 유저가 작성한 다이어리랑 댓글 개수 가져오기")
	void findAllByUserIdWithCommentCount() {
		// Given
		Long userId = 1L;

		Diary diary = Diary.builder()
				.userId(userId)
				.title("Test title")
				.content("Test content")
				.imageUrl("")
				.build();

		diary = testDiaryRepository.save(diary);

//		해당 다이어리에 작성된 댓글
		Comment comment1 = Comment.builder()
				.content("comment1")
				.typeId(diary.getDiaryId())
				.type(true)
				.build();
		testCommentRepository.save(comment1);

//		해당 다이어리에 작성되지 않은 댓글
		Comment comment2 = Comment.builder()
				.content("comment2")
				.typeId(2L)
				.type(true)
				.build();
		testCommentRepository.save(comment2);

		// When
		List<GetDiaryByUserResDto> result = testDiaryRepository.findAllByUserIdWithCommentCount(userId);

		// Then
		assertThat(result).isNotNull();
		assertThat(result).hasSize(1);

		GetDiaryByUserResDto dto = result.get(0);
		assertThat(dto.getDiaryId()).isEqualTo(diary.getDiaryId());
		assertThat(dto.getTitle()).isEqualTo(diary.getTitle());
		assertThat(dto.getContent()).isEqualTo(diary.getContent());
		assertThat(dto.getImageUrl()).isEqualTo(diary.getImageUrl());
		assertThat(dto.getSecret()).isEqualTo(diary.getSecret());
		assertThat(dto.getCreatedAt()).isEqualTo(diary.getCreatedAt());
		assertThat(dto.getUpdatedAt()).isEqualTo(diary.getUpdatedAt());

//		댓글 1개
		assertThat(dto.getCommentCount()).isEqualTo(1L);
	}


	@Test
	void findByIdWithUserNickName() {
	}

	@Test
	void findAllBySecretIsFalse() {
	}
}