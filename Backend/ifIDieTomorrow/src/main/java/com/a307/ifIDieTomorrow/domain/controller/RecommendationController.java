package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.recommendation.GetRecommendationDto;
import com.a307.ifIDieTomorrow.domain.service.RecommendationService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "명언/액션 추천", description = "APIs for daily action or quote recommendation")
@RestController
@RequestMapping("/insight")
@RequiredArgsConstructor
public class RecommendationController {

	private final RecommendationService recommendationService;

	@GetMapping("/{personalityId}")
	@Operation(summary = "명언/액선 추천", description = "주어진 성격에 해당하는 명언이나 액션을 추천해줍니다.(매일 갱신)")
	public ResponseEntity<GetRecommendationDto> getRecommendation(@PathVariable Long personalityId) throws NotFoundException {
		return ResponseEntity.status(HttpStatus.OK).body(recommendationService.getRecommendationByPersonalityId(personalityId));
	}




}
