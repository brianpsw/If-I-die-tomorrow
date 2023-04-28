package com.a307.ifIDieTomorrow.domain.dto.community;

import com.a307.ifIDieTomorrow.domain.entity.Report;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResDto {

	private Long reportId;
	private String content;
	private Boolean type;
	private Long typeId;
	private Integer reportCount;

	public static ReportResDto toDto(Report report, Integer reportCount) {
		return ReportResDto.builder()
				.reportId(report.getReportId())
				.content(report.getContent())
				.type(report.getType())
				.typeId(report.getTypeId())
				.reportCount(reportCount)
				.build();
	}
}
