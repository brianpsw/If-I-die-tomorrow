package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
	Optional<Category> findByCategoryId (Long categoryId);
	
	@Query("SELECT new com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto(userId, categoryId, name, objectId) " +
			"FROM Category " +
			"WHERE userId = :userId " +
			"OR userId = 0")
	List<CreateCategoryResDto> findAllByUserId(@Param("userId") Long userId);
	
	Category findByUserIdAndObjectId (Long userId, Long objectId);
	
	@Modifying
	@Transactional
	@Query("DELETE " +
			"FROM Category " +
			"WHERE userId = :userId")
	void deleteAllByUserId (@Param("userId") Long userId);
}
