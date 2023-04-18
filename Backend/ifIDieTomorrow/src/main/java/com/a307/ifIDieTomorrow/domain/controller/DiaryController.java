package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.diary.DiaryCreateReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.DiaryCreateResDto;
import com.a307.ifIDieTomorrow.domain.service.DiaryService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
//@Api(value = "다이어리 관련 컨트롤러")
@RequestMapping("/diary")
@RequiredArgsConstructor
public class DiaryController {

	private final DiaryService diaryService;

	@GetMapping("")
	public ResponseEntity<DiaryCreateResDto> createDiary(
			@RequestBody MultipartFile photo,
			@RequestBody DiaryCreateReqDto req
			) throws IOException, NotFoundException
	{
		return ResponseEntity.status(HttpStatus.CREATED).body(diaryService.createDiary(req, photo));
	}


}
