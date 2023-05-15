package com.a307.ifIDieTomorrow.domain.dto.will;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetWillByUserResDto {
	
	private Long willId;
	private String name;
	private String content;
	private String videoUrl;
	private String signUrl;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
}
