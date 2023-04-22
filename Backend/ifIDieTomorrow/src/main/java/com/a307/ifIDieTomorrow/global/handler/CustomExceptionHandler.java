package com.a307.ifIDieTomorrow.global.handler;

import com.a307.ifIDieTomorrow.global.exception.BadRequestException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class CustomExceptionHandler {

//	custom 400 error
	@ExceptionHandler({BadRequestException.class})
	public ResponseEntity<?> handleBadRequestException(final BadRequestException ex){
		log.warn("400 bad request error", ex);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

//	400 runtime error
	@ExceptionHandler({RuntimeException.class})
	public ResponseEntity<?> handleBadRequestException(final RuntimeException ex){
		log.warn("400 bad request error", ex);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

	@ExceptionHandler({NotFoundException.class})
	public ResponseEntity<?> handleNotFoundException(final NotFoundException ex){
		log.warn("404 not found error", ex);
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
	}

	@ExceptionHandler({NoPhotoException.class})
	public ResponseEntity<?> handleNoPhotoException(final NoPhotoException ex){
		log.warn("400 bad request(no photo) error", ex);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
	}

//	500 error
	@ExceptionHandler({Exception.class})
	public ResponseEntity<?> handleAll(final Exception ex){
		log.info(ex.getClass().getName());
		log.error("500 error", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
	}

}
