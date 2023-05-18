package com.a307.ifIDieTomorrow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

/**
 * action의 경우 지속적으로 생성/수정/삭제 되는 것이 아니기에 createdAt/updatedAt을 상속하지 않았습니다.
 */
@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "action")
public class Action {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long actionId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "personality_id", nullable = false)
	private Personality personality;
	
	@Column(nullable = false)
	private String content;
	
}
