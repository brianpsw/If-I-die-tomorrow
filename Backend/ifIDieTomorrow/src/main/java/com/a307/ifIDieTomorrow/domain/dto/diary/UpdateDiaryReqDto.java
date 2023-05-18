package com.a307.ifIDieTomorrow.domain.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDiaryReqDto {

	private Long diaryId;
	private String title;
	private String content;
	private Boolean secret;
	private Boolean updatePhoto;
}
