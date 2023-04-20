package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BucketRepository extends JpaRepository<Bucket, Long> {
	Optional<Bucket> findByBucketId (Long bucketId);
	
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto(bucketId, title, complete, secret) " +
			"FROM Bucket " +
			"WHERE userId = :userId " +
			"ORDER BY complete, updatedAt DESC ")
	List<GetBucketByUserResDto> findAllByUserId (@Param("userId") Long userId);
}
