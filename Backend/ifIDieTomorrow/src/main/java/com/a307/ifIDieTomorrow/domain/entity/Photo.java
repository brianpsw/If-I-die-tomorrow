package com.a307.ifIDieTomorrow.domain.entity;

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
@Table(name = "photo")
public class Photo extends BaseEntity {
	
	@Column(nullable = false)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long photoId;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "categoryId", nullable = false)
	private Category category;

	@Column(nullable = false)
	private Long userId;
	
	@Column(nullable = false)
	private String imageUrl;

	@Column(columnDefinition = "TEXT")
	private String caption;
	
	private String imageType;
	
	public void updateCaption(String caption) {
		this.caption = caption;
	}
	
}
