package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.recommendation.GetRecommendationDto;
import com.a307.ifIDieTomorrow.domain.repository.RecommendationRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService{

	private final RecommendationRepository recommendationRepository;

	@Override
	public GetRecommendationDto getRecommendationByPersonalityId(Long personalityId) throws NotFoundException {

		return GetRecommendationDto.builder()
				.content(recommendationRepository.findByPersonalityId(personalityId)
						.orElseThrow(() -> new NotFoundException("주어진 id에 해당하는 추천 명언이 없습니다."))
						.getContent())
				.build();


	}




}
