package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.service.DiaryService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
//@Api(value = "다이어리 관련 컨트롤러")
@RequestMapping("/diary")
@RequiredArgsConstructor
public class DiaryController {

	private final DiaryService diaryService;

	@PostMapping ("")
	public ResponseEntity<CreateDiaryResDto> createDiary(
			@RequestPart(required = false) MultipartFile photo,
			@RequestPart CreateDiaryReqDto req
			) throws IOException, NotFoundException
	{
		return ResponseEntity.status(HttpStatus.CREATED).body(diaryService.createDiary(req, photo));
	}

//	이후 jwt 적용 시 수정
	@GetMapping("/{userId}")
	public ResponseEntity<List<GetDiaryResDto>> getDiaryByUserId(@PathVariable Long userId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.getDiaryByUserId(userId));
	}


}
