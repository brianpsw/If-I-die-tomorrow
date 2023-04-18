package com.a307.ifIDieTomorrow.domain.entity;


import com.sun.istack.NotNull;
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
@Table(name = "report")
public class Report {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column
	@NotNull
	private Long reportId;

	@Column
	@NotNull
	private Long userId;

	@Column(columnDefinition = "TEXT")
	@NotNull
	private String content;


//	다이어리인지 버킷인지 (T: 다이어리, F: 버킷)
	@Column
	@NotNull
	private Boolean type;

//	해당 엔티티(다이어리/버킷)의 아이디
	@Column
	@NotNull
	private Long typeId;
}
