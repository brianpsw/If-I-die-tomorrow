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
@Table(name = "after")
public class After {
	
	@Column
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long afterId;
	
	@Column
	@NotNull
	private Long userId;
	
	@Column
	@NotNull
	private String uuid;
}
