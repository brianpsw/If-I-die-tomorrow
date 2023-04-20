package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto" +
			"(d.diaryId, d.title, d.content, d.imageUrl, d.secret, d.createdAt, d.updatedAt, COUNT(c.commentId)) " +
			"FROM Diary d " +
			"LEFT JOIN Comment c " +
			"ON d.diaryId = c.typeId " +
			"AND c.type = true " +
			"WHERE d.userId = :userId " +
			"GROUP BY d.diaryId")
	List<GetDiaryByUserResDto> findAllByUserIdWithCommentCount (@Param("userId") Long userId);

	@Query("SELECT NEW com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto" +
			"(d.diaryId, d.userId, u.nickname, d.title, d.content, d.imageUrl, d.secret, d.createdAt, d.updatedAt) " +
			"FROM Diary d " +
			"JOIN User u " +
			"ON d.userId = u.userId " +
			"WHERE d.diaryId = :diaryId")
	Optional<GetDiaryResDto> findByIdWithUserNickName(@Param("diaryId") Long diaryId);


}
