package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.service.DiaryService;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Tag(name = "다이어리", description = "APIs for DIARY")
@RestController
@RequestMapping("/diary")
@RequiredArgsConstructor
public class DiaryController {

	private final DiaryService diaryService;

	@PostMapping ("")
	@Operation(summary = "다이어리 작성", description = "다이어리를 작성합니다. 사진을 업로드 할 수 있습니다(필수 아님)")
	public ResponseEntity<CreateDiaryResDto> createDiary(
			@RequestPart(required = false, value = "photo") MultipartFile photo,
			@RequestPart(value = "req") CreateDiaryReqDto req
			) throws IOException, NotFoundException, NoPhotoException {
		return ResponseEntity.status(HttpStatus.CREATED).body(diaryService.createDiary(req, photo));
	}

//	이후 jwt 적용 시 수정
	@GetMapping("/{userId}")
	@Operation(summary = "내가 적은 다이어리 리스트", description = "내가 적은 다이어리 리스트를 불러옵니다. 댓글 개수(내용은 안 감)이 같이 갑니다")
	public ResponseEntity<List<GetDiaryByUserResDto>> getDiaryByUserId(@PathVariable Long userId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.getDiaryByUserId(userId));
	}

	@GetMapping("/detail/{diaryId}")
	@Operation(summary = "다이어리 하나 불러오기", description = "다이어리 아이디로 특정 다이어리 하나만 불러옵니다. 작성자 아이디와 닉네임이 같이 가며 댓글 리스트도 같이 갑니다")
	public ResponseEntity<HashMap<String, Object>> getDiaryByDiaryId(@PathVariable Long diaryId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.getDiaryById(diaryId));
	}

	@DeleteMapping("/{diaryId}")
	@Operation(summary = "다이어리 삭제하기", description = "다이어리를 삭제하고 사진도 삭제하고 댓글도 삭제합니다.")
	public ResponseEntity<Long> deleteDiary(@PathVariable Long diaryId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(diaryService.deleteDiaryByDiaryId(diaryId));
	}


}
