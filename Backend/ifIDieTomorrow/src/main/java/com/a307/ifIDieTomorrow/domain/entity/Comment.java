package com.a307.ifIDieTomorrow.domain.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@Table(name = "comment")
public class Comment {

	@Column
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long commentId;
	
	@Column
	@NotNull
	private Long userId;
	
	@Column(columnDefinition = "TEXT")
	@NotNull
	private String content;
	
	@Column
	@NotNull
	private Boolean type;
	
	@Column
	@NotNull
	private Long typeId;
}
