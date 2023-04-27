package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.After;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AfterRepository  extends JpaRepository<After, Long> {
    Optional<After> findByUuid (String Uuid);
}
