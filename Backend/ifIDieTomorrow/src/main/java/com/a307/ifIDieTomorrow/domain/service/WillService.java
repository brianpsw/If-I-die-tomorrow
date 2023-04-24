package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;

public interface WillService {
	GetWillByUserResDto getWillByUserId () throws NotFoundException;
}
