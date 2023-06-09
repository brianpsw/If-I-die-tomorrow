package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto;
import com.a307.ifIDieTomorrow.domain.entity.Receiver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface ReceiverRepository extends JpaRepository<Receiver, Long> {
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.receiver.CreateReceiverResDto" +
			"(receiverId, name, phoneNumber) " +
			"FROM Receiver " +
			"WHERE userId = :userId " )
	List<CreateReceiverResDto> findAllByUserId (@Param("userId") Long userId);
	
	Optional<Receiver> findByReceiverId (Long receiverId);
	
	@Modifying
	@Transactional
	@Query("DELETE " +
			"FROM Receiver " +
			"WHERE userId = :userId")
	void deleteAllByUserId (Long userId);
}
