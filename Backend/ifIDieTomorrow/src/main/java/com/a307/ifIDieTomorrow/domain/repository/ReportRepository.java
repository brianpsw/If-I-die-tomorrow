package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

	Boolean existsByUserIdAndTypeAndTypeId(Long userId, Boolean type, Long typeId);

	List<Report> findAllByTypeAndTypeIdOrderByCreatedAtDesc(Boolean type, Long typeId);
}
