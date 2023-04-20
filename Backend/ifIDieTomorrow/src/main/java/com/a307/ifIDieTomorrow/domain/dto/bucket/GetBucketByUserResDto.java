package com.a307.ifIDieTomorrow.domain.dto.bucket;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBucketByUserResDto {

	private Long bucketId;
	private String title;
	private Boolean complete;
	private Boolean secret;

}
