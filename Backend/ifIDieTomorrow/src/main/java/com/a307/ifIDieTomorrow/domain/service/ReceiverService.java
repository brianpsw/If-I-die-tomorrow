package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;

public interface ReceiverService {
	CreateReceiverResDto createReceiver (CreateReceiverDto data);
}
