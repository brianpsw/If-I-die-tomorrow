package com.a307.ifIDieTomorrow.domain.dto.receiver;

import com.a307.ifIDieTomorrow.domain.entity.Receiver;
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
	
	public static CreateReceiverResDto toDto(Receiver receiver) {
		return new CreateReceiverResDto(
				receiver.getReceiverId(),
				receiver.getName(),
				receiver.getPhoneNumber(),
				receiver.getCreatedAt(),
				receiver.getUpdatedAt()
		);
	}
	
}
