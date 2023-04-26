package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class CommentRepositoryTest {

	@Autowired
	private CommentRepository testCommentRepository;
	@Autowired
	private UserRepository testUserRepository;

	@AfterEach
	void tearDown() {
		testCommentRepository.deleteAllInBatch();
		testUserRepository.deleteAllInBatch();
	}

	@Test
	@DisplayName("특정 다이어리/버킷의 댓글 + 닉네임 조회하기")
	void findCommentsByTypeId() {

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

//		1번 다이어리에 작성된 댓글 2개
		Comment comment1 = testCommentRepository.save(
				Comment.builder()
						.userId(user.getUserId())
						.content("comment1 for diary 1")
						.typeId(1L)
						.type(true)
						.build()
		);

		Comment comment2 = testCommentRepository.save(
				Comment.builder()
						.userId(user.getUserId())
						.content("comment2 for diary 2")
						.typeId(1L)
						.type(true)
						.build()
		);

//		1번 버킷에 작성된 댓글
		Comment comment3 = testCommentRepository.save(
				Comment.builder()
						.userId(user.getUserId())
						.content("comment1 for bucket 1")
						.typeId(1L)
						.type(false)
						.build()
		);

		// When
		List<GetCommentResDto> result = testCommentRepository.findCommentsByTypeId(1L, true);

		// Then

//		댓글 2개, 작성자 tommy
		assertThat(result)
				.hasSize(2)
				.allSatisfy(dto -> assertThat(dto.getNickname()).isEqualTo("tommy"));
//		첫번째 댓글 아이디 비교 검증
		assertThat(result.get(0).getCommentId()).isEqualTo(comment1.getCommentId());
		
	}

	@Test
	@DisplayName("특정 다이어리/버킷의 댓글 조회하기")
	void findAllByTypeIdAndType() {
		
		// given
//		1번 다이어리에 작성된 댓글 2개
		Comment comment1 = testCommentRepository.save(
				Comment.builder()
						.userId(1L)
						.content("comment1 for diary 1")
						.typeId(1L)
						.type(true)
						.build()
		);

		Comment comment2 = testCommentRepository.save(
				Comment.builder()
						.userId(1L)
						.content("comment2 for diary 2")
						.typeId(1L)
						.type(true)
						.build()
		);

//		1번 버킷에 작성된 댓글
		Comment comment3 = testCommentRepository.save(
				Comment.builder()
						.userId(1L)
						.content("comment1 for bucket 1")
						.typeId(1L)
						.type(false)
						.build()
		);
		
		// when
		List<Comment> result = testCommentRepository.findAllByTypeIdAndType(1L, true);

		// then
		assertThat(result.get(0)).isEqualTo(comment1);
		assertThat(result.get(1)).isEqualTo(comment2);

	}
}