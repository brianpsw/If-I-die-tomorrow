package com.a307.ifIDieTomorrow.domain.entity;

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
@Table(name = "diary")
public class Diary extends BaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	private Long diaryId;
	
	@Column(nullable = false)
	private Long userId;

	@Column(nullable = false)
	private String title;
	
	@Column(columnDefinition = "TEXT", nullable = false)
	private String content;
	
	// null 허용
	@Column
	private String imageUrl;

	@Column(nullable = false)
	@ColumnDefault("false")
	private Boolean secret;

	@Column(nullable = false)
	@ColumnDefault("0")
	private Integer report;


	public void updateDiary(String title, String content, String imageUrl, Boolean secret) {
		this.title = title;
		this.content = content;
		this.imageUrl = imageUrl;
		this.secret = secret;

	}
}
