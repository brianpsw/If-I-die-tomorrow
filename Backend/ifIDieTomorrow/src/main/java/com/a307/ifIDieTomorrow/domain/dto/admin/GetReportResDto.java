package com.a307.ifIDieTomorrow.domain.dto.admin;

import com.a307.ifIDieTomorrow.domain.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class GetReportResDto {

	private Long reportId;
	private String content;
	private Long userId;
	private Boolean type;
	private Long typeId;
	private LocalDateTime createdAt;

	public static GetReportResDto toDto(Report report){
		return GetReportResDto.builder()
				.reportId(report.getReportId())
				.content(report.getContent())
				.userId(report.getUserId())
				.type(report.getType())
				.typeId(report.getTypeId())
				.createdAt(report.getCreatedAt())
				.build();
	}

}
