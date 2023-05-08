package com.a307.ifIDieTomorrow.domain.dto.will;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWillContentDto {
	
	private String content;
	
}
