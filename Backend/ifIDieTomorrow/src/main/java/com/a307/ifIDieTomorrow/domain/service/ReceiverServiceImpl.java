package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import com.a307.ifIDieTomorrow.domain.repository.ReceiverRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReceiverServiceImpl implements ReceiverService {
	
	private final ReceiverRepository receiverRepository;
	
	@Override
	public CreateReceiverResDto createReceiver (CreateReceiverDto data) {
		Receiver receiver = Receiver.builder()
				.userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
				.name(data.getName())
				.phoneNumber(data.getPhoneNumber())
				.build();
		
		return CreateReceiverResDto.toDto(receiverRepository.save(receiver));
	}
	
	@Override
	public List<CreateReceiverResDto> getReceiver () {
		return receiverRepository.findAllByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
	}
	
}
