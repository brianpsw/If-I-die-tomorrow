package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.admin.AdjustReportReqDto;
import com.a307.ifIDieTomorrow.domain.dto.admin.AdjustReportResDto;
import com.a307.ifIDieTomorrow.domain.dto.admin.GetOverLimitResDto;
import com.a307.ifIDieTomorrow.domain.dto.admin.GetReportResDto;
import com.a307.ifIDieTomorrow.domain.service.AdminService;
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

@Tag(name = "관리자", description = "APIs for Admin")
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

	private final AdminService adminService;

	@GetMapping(value = "/report")
	@Operation(summary = "신고 5회 이상 게시글 조회", description = "신고 횟수가 5회 이상 누적된 다이어리/버킷을 조회해 신고 많은 순으로 정렬해서 반환")
	public ResponseEntity<List<GetOverLimitResDto>> getOverLimit() throws UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(adminService.getBucketOrDiaryOverReportLimit());
	}

	@GetMapping(value = "/report/{type}/{typeId}")
	@Operation(summary = "개별 게시글의 신고 내역 조회", description = "Diary: T, Bucekt: F 입니다")
	public ResponseEntity<List<GetReportResDto>> GetReportsByArticleId(@PathVariable Boolean type, @PathVariable Long typeId) throws NotFoundException, UnAuthorizedException
	{
		return ResponseEntity.status(HttpStatus.OK).body(adminService.getReportsByTypeAndTypeId(type, typeId));
	}

	@PutMapping(value = "/report")
	@Operation(summary = "개별 게시글의 신고 횟수를 조정합니다.", description = "개별 게시글의 신고 횟수를 조정합니다.")
	public ResponseEntity<AdjustReportResDto> adjustReport(@RequestBody AdjustReportReqDto req) throws NotFoundException, UnAuthorizedException {
		return ResponseEntity.status(HttpStatus.OK).body(adminService.adjustReportCount(req));
	}


}
