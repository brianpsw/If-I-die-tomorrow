package com.a307.ifIDieTomorrow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "recommendation")
public class Recommendation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long recommendationId;

	@Column(nullable = false)
	private Long actionId;

	@Column(nullable = false)
	private Long personalityId;

	@Column(nullable = false)
	private String content;

//	db에서 스케줄링을 통해 업데이트 되기 때문에 따로 annotation은 설정 x
	@Column
	private LocalDateTime updatedAt;


}
