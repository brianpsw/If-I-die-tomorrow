package com.a307.ifIDieTomorrow.domain.dto.community;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportReqDto {

	private String content;
	private Boolean type;
	private Long typeId;

}
