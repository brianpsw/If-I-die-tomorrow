package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto;
import com.a307.ifIDieTomorrow.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto" +
			"(photoId, imageUrl, caption, imageType, createdAt, updatedAt) " +
			"FROM Photo " +
			"WHERE category.categoryId = :categoryId AND userId = :userId " +
			"ORDER BY createdAt DESC")
	List<GetPhotoResDto> findAllPhotoByCategory_CategoryId (@Param("categoryId") Long categoryId,@Param("userId") Long userId);
	
	@Modifying
	@Transactional
	@Query("DELETE " +
			"FROM Photo " +
			"WHERE category.categoryId = :categoryId ")
	void deleteAllByCategory_CategoryId (@Param("categoryId") Long categoryId);
	
	Optional<Photo> findByPhotoId (Long photoId);
	
	List<Photo> findAllByUserId (Long userId);
}
