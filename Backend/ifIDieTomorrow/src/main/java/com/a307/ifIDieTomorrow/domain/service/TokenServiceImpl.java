package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverDto;
import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.dto.recommendation.GetRecommendationDto;
import com.a307.ifIDieTomorrow.domain.dto.token.RegisterTokenDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import com.a307.ifIDieTomorrow.domain.entity.Token;
import com.a307.ifIDieTomorrow.domain.repository.RecommendationRepository;
import com.a307.ifIDieTomorrow.domain.repository.TokenRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService{

	private final TokenRepository tokenRepository;


	@Override
	public String registerToken(RegisterTokenDto data) throws NotFoundException {
		if(data.getToken() == null || "".equals(data.getToken())) throw new NotFoundException("등록토큰이 없습니다.");
		List<Token> tokenList = tokenRepository.findAllByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
		boolean flag = true;
		for (Token token:
			 tokenList) {
			if(data.getToken().equals(token.getToken())){
				flag = false;
				break;
			}
		}
		if(flag){
			Token token = Token.builder()
					.userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
					.token(data.getToken())
					.build();
			tokenRepository.save(token);
			return token.getToken();
		}
		else return "이미 등록된 기기입니다.";
	}
}
