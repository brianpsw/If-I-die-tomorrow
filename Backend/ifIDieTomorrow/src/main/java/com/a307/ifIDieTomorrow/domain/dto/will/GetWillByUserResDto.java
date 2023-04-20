package com.a307.ifIDieTomorrow.domain.dto.will;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetWillByUserResDto {
	
	private Long willId;
	private String content;
	private String videoUrl;
	private String voiceUrl;
	private String signUrl;
	
}
