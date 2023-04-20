package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.domain.repository.WillRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WillServiceImpl implements WillService {
	
	private final UserRepository userRepository;
	
	private final WillRepository willRepository;
	
	@Override
	public GetWillByUserResDto getWillByUserId (Long userId) throws NotFoundException {
		if (!userRepository.existsByUserId(userId)) throw new NotFoundException("존재하지 않는 유저입니다.");
		
		return willRepository.findByUserId(userId);
	}
}
