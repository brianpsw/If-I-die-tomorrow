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
@Table(name = "bucket")
public class Bucket extends BaseEntity {

	@Column(nullable = false)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bucketId;
	
	@Column(nullable = false)
	private Long userId;
	
	@Column(length = 100, nullable = false)
	private String title;
	
	@Column(columnDefinition = "TEXT")
	private String content;
	
	private String complete;
	
	private String imageUrl;
	
	private Boolean secret;
	
	@Column(nullable = false)
	@ColumnDefault("0")
	private Integer report;
	
	private String imageType;
	
	public void updateBucket (String title, String content, String complete, String imageUrl, Boolean secret, String imageType) {
		this.title = title;
		this.content = content;
		this.complete = complete;
		this.imageUrl = imageUrl;
		this.secret = secret;
		this.imageType = imageType;
	}
	
	public void updateTitle(String title) {
		this.title = title;
	}

	public void reportBucket(){
		this.report ++;
	}

	public void adjustReport(Integer reportCount){

		this.report = reportCount;
	}

	
}
