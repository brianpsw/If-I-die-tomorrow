package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import com.a307.ifIDieTomorrow.domain.repository.ReceiverRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
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
	public CreateReceiverResDto createReceiver (CreateReceiverDto data) throws IllegalArgumentException {
		if ("".equals(data.getName().trim()) || "".equals(data.getPhoneNumber().trim())) throw new IllegalArgumentException("내용이 없습니다.");
		
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
	
	@Override
	public Long deleteReceiver (Long receiverId) throws NotFoundException, UnAuthorizedException {
		Receiver receiver = receiverRepository.findByReceiverId(receiverId)
				.orElseThrow(() -> new NotFoundException("존재하지 않는 Receiver id 입니다."));
		
		if (receiver.getUserId() != ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
			throw new UnAuthorizedException("삭제할 권한이 없습니다.");
		
		receiverRepository.delete(receiver);
		
		return receiverId;
	}
	
}
