package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Will;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface WillRepository extends JpaRepository<Will, Long> {
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto(willId, content, videoUrl, voiceUrl, signUrl) " +
			"FROM Will " +
			"WHERE userId = :userId " )
	GetWillByUserResDto findByUserId (@Param("userId") Long userId);
}
