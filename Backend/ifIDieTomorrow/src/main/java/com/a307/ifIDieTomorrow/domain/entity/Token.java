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
@Table(name = "token", uniqueConstraints = @UniqueConstraint(columnNames = { "userId", "token" }))
public class Token {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long tokenId;
	
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String token;
	
}
