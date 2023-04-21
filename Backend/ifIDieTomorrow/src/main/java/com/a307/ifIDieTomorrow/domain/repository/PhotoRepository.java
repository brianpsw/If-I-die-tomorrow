package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
	List<Long> findAllPhotoIdByCategory_CategoryId (Long categoryId);
	
	void deleteAllInBatchByPhotoIdIn (List<Long> allByCategory_categoryId);
}
