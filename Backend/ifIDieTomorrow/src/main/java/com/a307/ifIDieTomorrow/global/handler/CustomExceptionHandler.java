package com.a307.ifIDieTomorrow.global.handler;

import com.a307.ifIDieTomorrow.global.exception.BadRequestException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class CustomExceptionHandler {

	@ExceptionHandler
	public ResponseEntity<?> handleBadRequestException(final BadRequestException ex){
		log.warn("400 bad request error", ex);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler
	public ResponseEntity<?> handleNotFoundException(final NotFoundException ex){
		log.warn("404 not found error", ex);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}


}
