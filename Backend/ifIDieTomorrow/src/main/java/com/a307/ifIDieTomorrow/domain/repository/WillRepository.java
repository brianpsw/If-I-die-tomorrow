package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Will;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface WillRepository extends JpaRepository<Will, Long> {
	// DTO 를 가져올 때
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto" +
			"(w.willId, u.name, w.content, w.videoUrl, w.signUrl, w.createdAt, w.updatedAt) " +
			"FROM Will w " +
			"JOIN User u " +
			"ON u.userId = w.userId " +
			"WHERE w.userId = :userId " )
	Optional<GetWillByUserResDto> getByUserId (@Param("userId") Long userId);
	
	// Entity 를 가져올 때
	Will findByUserId (Long userId);
	
	@Modifying
	@Transactional
	@Query("DELETE " +
			"FROM Will " +
			"WHERE userId = :userId")
	void deleteByUserId (@Param("userId") Long userId);
}
