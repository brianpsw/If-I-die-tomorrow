package com.a307.ifIDieTomorrow.domain.dto.bucket;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBucketResDto {

	private Long bucketId;
	private String title;
	private Boolean complete;
	private Boolean secret;

}
