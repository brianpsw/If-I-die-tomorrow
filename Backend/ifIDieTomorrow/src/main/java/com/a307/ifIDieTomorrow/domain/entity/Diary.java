package com.a307.ifIDieTomorrow.domain.entity;

import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@ToString
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
	@ColumnDefault("true")
	private Boolean secret;

	@Column(nullable = false)
	@ColumnDefault("0")
	private Integer report;

	private String imageType;

	public void updateDiary(String title, String content, String imageUrl, Boolean secret, String imageType) {
		this.title = title;
		this.content = content;
		this.imageUrl = imageUrl;
		this.secret = secret;
		this.imageType = imageType;
	}

	public void reportDiary(){
		this.report ++;
	}

	public void adjustReport(Integer reportCount){
		this.report = reportCount;
	}

}
