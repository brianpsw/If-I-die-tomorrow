package com.a307.ifIDieTomorrow.domain.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class AdjustReportReqDto {

	private Boolean type;
	private Long typeId;
	private Integer reportCount;
}
