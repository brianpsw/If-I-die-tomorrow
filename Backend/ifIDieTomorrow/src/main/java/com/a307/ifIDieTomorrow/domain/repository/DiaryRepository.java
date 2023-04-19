package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto(d.diaryId, d.userId, d.title, d.content, d.imageUrl, d.secret, d.report, COUNT(c.commentId)) " +
			"FROM Diary d " +
			"LEFT JOIN Comment c " +
			"ON d.diaryId = c.typeId " +
			"WHERE c.type = true " +
			"AND d.userId = :userId " +
			"GROUP BY d.diaryId")
	List<GetDiaryResDto> findAllByUserIdWithCommentCount (@Param("userId") Long userId);




}
