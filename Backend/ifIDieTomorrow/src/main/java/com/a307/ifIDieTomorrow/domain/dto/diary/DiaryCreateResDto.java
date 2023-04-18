package com.a307.ifIDieTomorrow.domain.dto.diary;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DiaryCreateResDto {

	private Long diaryId;

	private Long userId;

	private String title;

	private String content;

	private String imageUrl;

	private Boolean secret;

	private Integer report;

	public static DiaryCreateResDto toDto(Diary diary){
		return DiaryCreateResDto.builder()
				.diaryId(diary.getDiaryId())
				.title(diary.getTitle())
				.content(diary.getContent())
				.imageUrl(diary.getImageUrl())
				.secret(diary.getSecret())
				.report(diary.getReport())
				.build();
	}
}
