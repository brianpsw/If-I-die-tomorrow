package com.a307.ifIDieTomorrow.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class UnAuthorizedException extends Exception{

	public UnAuthorizedException(String message) {
		super(message);
	}
}
