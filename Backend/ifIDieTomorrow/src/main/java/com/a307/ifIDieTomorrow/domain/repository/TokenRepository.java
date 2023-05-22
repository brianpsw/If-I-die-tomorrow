package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import com.a307.ifIDieTomorrow.domain.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

	List<Token> findAllByUserId (@Param("userId") Long userId);

}
