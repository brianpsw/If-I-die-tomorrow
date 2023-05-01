package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.UpdateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.service.DiaryService;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.FileChecker;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

	@PostMapping (value = "", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
	@Operation(summary = "다이어리 작성", description = "다이어리를 작성합니다. 사진을 업로드 할 수 있습니다(필수 아님)")
	public ResponseEntity<CreateDiaryResDto> createDiary(
			@RequestPart(value = "data") CreateDiaryReqDto data,
			@RequestPart(required = false, value = "photo") MultipartFile photo
			) throws IOException, NotFoundException, NoPhotoException, IllegalArgumentException, ImageProcessingException, MetadataException {
		if (photo != null && !FileChecker.imageCheck(photo.getInputStream())) throw new IllegalArgumentException("허용되지 않은 확장자입니다.");
		return ResponseEntity.status(HttpStatus.CREATED).body(diaryService.createDiary(data, photo));
	}

//	이후 jwt 적용 시 수정
	@GetMapping("")
	@Operation(summary = "내가 적은 다이어리 리스트", description = "내가 적은 다이어리 리스트를 불러옵니다. 댓글 개수(내용은 안 감)이 같이 갑니다")
	public ResponseEntity<List<GetDiaryByUserResDto>> getDiaryByUserId() {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.getDiaryByUserId());
	}

	@GetMapping("/{diaryId}")
	@Operation(summary = "다이어리 하나 불러오기", description = "다이어리 아이디로 특정 다이어리 하나만 불러옵니다. 작성자 아이디와 닉네임이 같이 가며 댓글 리스트도 같이 갑니다")
	public ResponseEntity<HashMap<String, Object>> getDiaryByDiaryId(@PathVariable Long diaryId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.getDiaryById(diaryId));
	}

	@DeleteMapping("/{diaryId}")
	@Operation(summary = "다이어리 삭제하기", description = "다이어리를 삭제하고 사진도 삭제하고 댓글도 삭제합니다.")
	public ResponseEntity<Long> deleteDiary(@PathVariable Long diaryId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.NO_CONTENT).body(diaryService.deleteDiaryByDiaryId(diaryId));
	}

	@PutMapping("")
	@Operation(summary = "다이어리 수정하기", description = "다이어리를 수정합니다. 사진을 수정하고자 할 경우 기존 사진은 삭제 되고 새로운 사진이 업로드 됩니다")
	public ResponseEntity<CreateDiaryResDto> updateDiary(
			@RequestPart(value = "data") UpdateDiaryReqDto data,
			@RequestPart(value = "photo", required = false) MultipartFile photo
			) throws NotFoundException, IOException, IllegalArgumentException, UnAuthorizedException, ImageProcessingException, MetadataException {
		return ResponseEntity.status(HttpStatus.OK).body(diaryService.updateDiary(data, photo));
	}


}
