package com.a307.ifIDieTomorrow.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class BadRequestException extends Exception{

	public BadRequestException(String message){
		super (message);
	}
}
