package com.a307.ifIDieTomorrow.domain.dto.diary;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateDiaryResDto {

	private Long diaryId;

	private Long userId;

	private String title;

	private String content;

	private String imageUrl;

	private Boolean secret;

	private Integer report;
	
	private String imageType;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	public static CreateDiaryResDto toDto(Diary diary){
		return CreateDiaryResDto.builder()
				.diaryId(diary.getDiaryId())
				.title(diary.getTitle())
				.userId(diary.getUserId())
				.content(diary.getContent())
				.imageUrl(diary.getImageUrl())
				.secret(diary.getSecret())
				.report(diary.getReport())
				.imageType(diary.getImageType())
				.createdAt(diary.getCreatedAt())
				.updatedAt(diary.getUpdatedAt())
				.build();
	}
}
