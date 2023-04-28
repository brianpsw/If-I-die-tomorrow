package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceiverRepository extends JpaRepository<Receiver, Long> {
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto" +
			"(receiverId, name, phoneNumber) " +
			"FROM Receiver " +
			"WHERE userId = :userId " )
	List<CreateReceiverResDto> findAllByUserId (@Param("userId") Long userId);
}
