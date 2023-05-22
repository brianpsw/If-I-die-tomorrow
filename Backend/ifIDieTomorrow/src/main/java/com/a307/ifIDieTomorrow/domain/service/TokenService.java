package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.dto.token.RegisterTokenDto;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import org.springframework.stereotype.Service;

import java.util.List;

public interface TokenService {

	String registerToken (RegisterTokenDto data) throws NotFoundException;
}
