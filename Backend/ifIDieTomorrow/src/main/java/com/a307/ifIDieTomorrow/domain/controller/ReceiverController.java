package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.service.ReceiverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	
}
