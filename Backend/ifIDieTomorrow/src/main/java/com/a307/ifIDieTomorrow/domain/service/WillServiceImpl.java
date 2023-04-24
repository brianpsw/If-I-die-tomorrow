package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.repository.WillRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WillServiceImpl implements WillService {
	
	private final WillRepository willRepository;
	
	@Override
	public GetWillByUserResDto getWillByUserId () throws NotFoundException {
		return willRepository.findByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
				.orElseThrow(() -> new NotFoundException("유언을 찾을 수 없습니다."));
	}
}
