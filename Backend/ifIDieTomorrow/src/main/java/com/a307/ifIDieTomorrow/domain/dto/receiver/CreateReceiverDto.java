package com.a307.ifIDieTomorrow.domain.dto.receiver;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateReceiverDto {
	
	private String name;
	private String phoneNumber;
	
}
