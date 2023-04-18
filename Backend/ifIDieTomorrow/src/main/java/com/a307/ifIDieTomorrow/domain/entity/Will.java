package com.a307.ifIDieTomorrow.domain.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "will")
public class Will extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	@NotNull
	private Long willId;
	
	@Column
	@NotNull
	private Long userId;
	
	// 유저가 텍스트로 입력하거나 음성으로 올릴 수 있어서 null 허용
	@Column(columnDefinition = "TEXT")
	private String content;
	
	@Column
	private String voice_url;
	
	// 일단 null 열어뒀습니다.
	@Column
	private String sign_url;
	
}
