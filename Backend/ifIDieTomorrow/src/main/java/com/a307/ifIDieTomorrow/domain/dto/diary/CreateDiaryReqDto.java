package com.a307.ifIDieTomorrow.domain.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateDiaryReqDto {

	private String title;
	private String content;
	private Boolean secret;

//	사진이 있는지 없는지 여부를 나타내는 변수
	private Boolean hasPhoto;


}
