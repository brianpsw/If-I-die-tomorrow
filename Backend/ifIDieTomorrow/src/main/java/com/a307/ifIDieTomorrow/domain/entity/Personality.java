package com.a307.ifIDieTomorrow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * personality의 경우 지속적으로 생성/수정/삭제 되는 것이 아니기에 createdAt/updatedAt을 상속하지 않았습니다.
 */
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "personality")
public class Personality {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long personalityId;
	
	@Column(nullable = false)
	private String name;
	
}
