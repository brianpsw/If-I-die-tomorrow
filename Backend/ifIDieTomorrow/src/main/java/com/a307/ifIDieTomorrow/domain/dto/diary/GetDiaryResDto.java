package com.a307.ifIDieTomorrow.domain.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDiaryResDto {

	private Long diaryId;

	private Long userId;

	private String nickname;

	private String title;

	private String content;

	private String imageUrl;

	private Boolean secret;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;


}
