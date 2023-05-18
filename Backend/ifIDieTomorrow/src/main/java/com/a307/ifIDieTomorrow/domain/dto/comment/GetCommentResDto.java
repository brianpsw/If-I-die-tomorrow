package com.a307.ifIDieTomorrow.domain.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetCommentResDto {

	private Long commentId;
	private String content;
	private Long userId;
	private String nickname;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

}
