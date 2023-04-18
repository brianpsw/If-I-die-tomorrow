package com.a307.ifIDieTomorrow.domain.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@Table(name = "user")
public class User extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	@NotNull
	private Long userId;
	
	@Column
	@NotNull
	private String name;
	
	@Column
	@NotNull
	private String email;
	
	@Column
	@NotNull
	private Integer age;
	
	@Column
	@NotNull
	private String nickname;
	
	@Column
	@NotNull
	@ColumnDefault("false")
	private Boolean sendAgree;
	
	@Column // 비동의 시 null로?
	private String personalPage;
	
	@Column // 가입 이후 검사 전까지는 null
	private Long personalityId;
	
	@Column
	@NotNull
	private Boolean newCheck;
	
	@Column
	@NotNull
	@ColumnDefault("false")
	private Boolean deleted;

//    토큰 관련 부분은 확실하지 않아서 작성하고 주석처리했습니다.
//    @Column
//    private String refreshToken;

}
