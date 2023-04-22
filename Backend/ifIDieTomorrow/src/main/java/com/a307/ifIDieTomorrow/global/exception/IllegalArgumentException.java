package com.a307.ifIDieTomorrow.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class IllegalArgumentException extends Exception {

	public IllegalArgumentException(String message) {
		super(message);
	}
}
