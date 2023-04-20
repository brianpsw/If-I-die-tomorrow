package com.a307.ifIDieTomorrow.global.exception;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class NoPhotoException extends Exception{

	public NoPhotoException(String message) {
		super(message);
	}
}
