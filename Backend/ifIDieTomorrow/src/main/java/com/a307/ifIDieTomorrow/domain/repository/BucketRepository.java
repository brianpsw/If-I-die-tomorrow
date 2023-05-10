package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
	
	@Query("SELECT NEW com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto" +
			"(b.bucketId, b.userId, u.nickname, b.title, b.content, b.complete, b.imageUrl, b.secret, b.createdAt, b.updatedAt) " +
			"FROM Bucket b " +
			"JOIN User u " +
			"ON b.userId = u.userId " +
			"WHERE b.bucketId = :bucketId")
	Optional<GetBucketResDto> findByBucketIdWithUserNickName (@Param("bucketId") Long bucketId);

	@Query("SELECT NEW com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto" +
			"(b.bucketId, b.userId, u.nickname, b.title, b.content, b.complete, b.imageUrl, b.secret, b.createdAt, b.updatedAt) " +
			"FROM Bucket b " +
			"JOIN User u " +
			"ON b.userId = u.userId " +
			"WHERE b.secret = false " +
			"AND b.report < :reportLimit " +
			"ORDER BY b.createdAt DESC")
	Page<GetBucketResDto> findAllBySecretIsFalseAndReportUnderLimit(Pageable pageable, @Param("reportLimit") Integer reportLimit);

	@Query("SELECT NEW com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto" +
			"(b.bucketId, b.userId, u.nickname, b.title, b.content, b.complete, b.imageUrl, b.secret, b.createdAt, b.updatedAt) " +
			"FROM Bucket b " +
			"JOIN User u " +
			"ON b.userId = u.userId " +
			"WHERE b.userId = :userId " +
			"ORDER BY b.createdAt ASC")
	List<GetBucketResDto> findAllByUserIdWithUserNickName (@Param("userId") Long userId);

	List<Bucket> findAllByReportIsGreaterThanEqual(Integer reportLimit);
}
