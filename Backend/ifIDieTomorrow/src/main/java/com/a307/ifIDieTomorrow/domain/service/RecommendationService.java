package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.recommendation.GetRecommendationDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;

public interface RecommendationService {
	GetRecommendationDto getRecommendationByPersonalityId(Long personalityId) throws NotFoundException;
}
