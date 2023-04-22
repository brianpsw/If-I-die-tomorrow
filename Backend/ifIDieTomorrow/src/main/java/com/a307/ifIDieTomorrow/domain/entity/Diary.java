package com.a307.ifIDieTomorrow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@Table(name = "diary")
public class Diary extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	@NotNull
	private Long diaryId;
	
	@Column
	@NotNull
	private Long userId;
	
	@Column
	@NotNull
	private String title;
	
	@Column(columnDefinition = "TEXT")
	@NotNull
	private String content;
	
	// null 허용
	@Column
	private String imageUrl;
	
	@Column
	@NotNull
	@ColumnDefault("false")
	private Boolean secret;
	
	@Column
	@NotNull
	@ColumnDefault("0")
	private Integer report;


	public void updateDiary(String title, String content, String imageUrl, Boolean secret) {
		this.title = title;
		this.content = content;
		this.imageUrl = imageUrl;
		this.secret = secret;

	}
}
