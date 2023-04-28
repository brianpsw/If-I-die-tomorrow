package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.service.ReceiverService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "리시버", description = "APIs for Receiver")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/receiver")
public class ReceiverController {

	private final ReceiverService receiverService;
	
	@PostMapping("")
	@Operation(summary = "리시버 추가", description = "사후 전송 페이지를 전달받을 사람을 추가합니다.")
	public ResponseEntity<CreateReceiverResDto> createReceiver(@RequestBody CreateReceiverDto data) {
		return ResponseEntity.status(HttpStatus.CREATED).body(receiverService.createReceiver(data));
	}
	
	@GetMapping("")
	@Operation(summary = "리시버 조회", description = "사후 전송 페이지를 전달받을 사람을 조회합니다.")
	public ResponseEntity<List<CreateReceiverResDto>> getReceiver() {
		return ResponseEntity.status(HttpStatus.OK).body(receiverService.getReceiver());
	}
	
	@DeleteMapping("/{receiverId}")
	@Operation(summary = "리시버 삭제", description = "리시버를 삭제합니다.")
	public ResponseEntity<Long> deleteReceiver(@PathVariable Long receiverId) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(receiverService.deleteReceiver(receiverId));
	}
	
}
