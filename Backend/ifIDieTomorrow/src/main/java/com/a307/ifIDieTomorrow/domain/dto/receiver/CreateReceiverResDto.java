package com.a307.ifIDieTomorrow.domain.dto.receiver;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class CreateReceiverResDto {
	
	private Long receiverId;
	private String name;
	private String phoneNumber;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	
}
