package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;

import java.util.List;

public interface ReceiverService {
	CreateReceiverResDto createReceiver (CreateReceiverDto data);
	
	List<CreateReceiverResDto> getReceiver ();
	
	Long deleteReceiver (Long receiverId) throws NotFoundException, UnAuthorizedException;
}
