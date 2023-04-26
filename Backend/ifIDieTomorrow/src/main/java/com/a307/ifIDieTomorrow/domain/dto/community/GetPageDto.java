package com.a307.ifIDieTomorrow.domain.dto.community;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetPageDto {

	private Object data;
	private Boolean hasNext;
}
