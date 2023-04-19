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
@Table(name = "bucket")
public class Bucket extends BaseEntity {

	@Column
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long bucketId;
	
	@Column
	@NotNull
	private Long userId;
	
	@Column(length = 100)
	@NotNull
	private String title;
	
	@Column(columnDefinition = "TEXT")
	private String content;
	
	@NotNull
	@Column
	@ColumnDefault("false")
	private Boolean complete;
	
	@Column
	private String imageUrl;
	
	@Column
	private Boolean secret;
	
	@Column
	@NotNull
	@ColumnDefault("0")
	private Integer report;
	
	public void updateBucket (String title, String content, Boolean complete, String imageUrl, Boolean secret) {
		this.title = title;
		this.content = content;
		this.complete = complete;
		this.imageUrl = imageUrl;
		this.secret = secret;
	}
	
}
