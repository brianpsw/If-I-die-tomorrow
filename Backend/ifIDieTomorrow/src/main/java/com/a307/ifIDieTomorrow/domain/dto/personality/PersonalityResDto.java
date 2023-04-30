package com.a307.ifIDieTomorrow.domain.dto.personality;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PersonalityResDto {

	private Long personalityId;
	private String name;


}
