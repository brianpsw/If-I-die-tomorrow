package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

	Boolean existsByUserIdAndTypeAndTypeId(Long userId, Boolean type, Long typeId);

	List<Report> findAllByTypeAndTypeIdOrderByCreatedAtDesc(Boolean type, Long typeId);
	
	@Modifying
	@Transactional
	@Query("DELETE " +
			"FROM Report " +
			"WHERE userId = :userId")
	void deleteAllByUserId (Long userId);
}
