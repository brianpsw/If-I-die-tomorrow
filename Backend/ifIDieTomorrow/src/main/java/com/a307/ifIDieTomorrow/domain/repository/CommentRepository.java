package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

	@Query("SELECT NEW com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto" +
			"(c.commentId, c.content, c.userId, u.nickname, c.createdAt, c.updatedAt) " +
			"FROM Comment c " +
			"JOIN User u " +
			"ON c.userId = u.userId " +
			"WHERE c.typeId = :typeId AND c.type = :type " +
			"ORDER BY c.createdAt ASC")
	List<GetCommentResDto> findCommentsByTypeId(@Param("typeId") Long typeId, Boolean type);

	List<Comment> findAllByTypeIdAndType(Long typeId, Boolean type);
}
