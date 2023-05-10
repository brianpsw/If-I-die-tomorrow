package com.a307.ifIDieTomorrow.domain.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
public class FamousSayingDto {

	private String content;
	private String author;

}
