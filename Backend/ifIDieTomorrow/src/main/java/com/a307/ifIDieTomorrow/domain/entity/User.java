package com.a307.ifIDieTomorrow.domain.entity;

import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@Table(name = "user")
public class User extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private Integer age;

	@Column(nullable = false)
	private String nickname;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean sendAgree;
	
	@Column // 비동의 시 null로?
	private String personalPage;
	
	@Column // 가입 이후 검사 전까지는 null
	private Long personalityId;

	@Column(nullable = false)
	@ColumnDefault("true")
	private Boolean newCheck;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean deleted;

	@Column(name = "provider_type", nullable = false, length = 20)
	@Enumerated(EnumType.STRING)
	private ProviderType providerType;


	public void setPersonality(Long personalityId){
		this.personalityId = personalityId;
	}

	public void setPersonalPage (String personalPage){
		this.personalPage = personalPage;
	}

}
