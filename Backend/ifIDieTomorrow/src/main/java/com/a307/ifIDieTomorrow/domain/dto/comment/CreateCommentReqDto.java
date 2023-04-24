package com.a307.ifIDieTomorrow.domain.dto.comment;

import com.a307.ifIDieTomorrow.domain.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentReqDto {

	private String content;
	private Boolean type;
	private Long typeId;

	public Comment toEntity (Long userId) {
		return Comment.builder()
				.content(content)
				.userId(userId)
				.type(type)
				.typeId(typeId)
				.build();
	}



}
