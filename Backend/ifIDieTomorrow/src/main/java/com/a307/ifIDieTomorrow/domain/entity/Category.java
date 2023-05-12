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
@Table(name = "category")
public class Category extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private Long categoryId;

	@Column(nullable = false)
	private Long userId;

	@Column(length = 100, nullable = false)
	private String name;
	
	private String imageUrl;
	
	public void updateCategoryName (String name) {
		this.name = name;
	}
	
}
