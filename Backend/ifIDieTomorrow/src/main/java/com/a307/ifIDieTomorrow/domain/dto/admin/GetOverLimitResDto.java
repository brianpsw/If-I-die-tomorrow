package com.a307.ifIDieTomorrow.domain.dto.admin;

import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class GetOverLimitResDto {

	private Boolean type;
	private Long typeId;
	private String title;
	private String content;
	private String imageUrl;
	private Integer report;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static GetOverLimitResDto toDto(Diary diary){

		return GetOverLimitResDto.builder()
				.type(true)
				.typeId(diary.getDiaryId())
				.title(diary.getTitle())
				.content(diary.getContent())
				.imageUrl(diary.getImageUrl())
				.report(diary.getReport())
				.createdAt(diary.getCreatedAt())
				.updatedAt(diary.getUpdatedAt())
				.build();
	}

	public static GetOverLimitResDto toDto(Bucket bucket){

		return GetOverLimitResDto.builder()
				.type(false)
				.typeId(bucket.getBucketId())
				.title(bucket.getTitle())
				.content(bucket.getContent())
				.imageUrl(bucket.getImageUrl())
				.report(bucket.getReport())
				.createdAt(bucket.getCreatedAt())
				.updatedAt(bucket.getUpdatedAt())
				.build();

	}

}
