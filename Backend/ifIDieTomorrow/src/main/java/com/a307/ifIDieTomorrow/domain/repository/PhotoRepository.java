package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto;
import com.a307.ifIDieTomorrow.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
	List<Long> findAllPhotoIdByCategory_CategoryId (Long categoryId);
	
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto" +
			"(photoId, imageUrl, caption, createdAt, updatedAt) " +
			"FROM Photo " +
			"WHERE category.categoryId = :categoryId " +
			"ORDER BY createdAt DESC")
	List<GetPhotoResDto> findAllPhotoByCategory_CategoryId (@Param("categoryId") Long categoryId);
	
	void deleteAllInBatchByPhotoIdIn (List<Long> allByCategory_categoryId);
	
	Optional<Photo> findByPhotoId (Long photoId);
}
