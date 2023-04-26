package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class CategoryRepositoryTest {
	
	@Autowired
	private CategoryRepository testCategoryRepository;
	
	@Autowired
	private UserRepository testUserRepository;
	
	@AfterEach
	void tearDown() {
		testCategoryRepository.deleteAllInBatch();
		testUserRepository.deleteAllInBatch();
	}
	
	@Test
	@DisplayName("Get Category by Category's id")
	void findByCategoryId() {
		
		// Given
		Category category = testCategoryRepository.save(
				Category.builder()
						.userId(1L)
						.name("category 1")
						.build()
		);
		
		// When
		Optional<Category> op = testCategoryRepository.findByCategoryId(category.getCategoryId());
		
		// Then
		assertThat(op).isPresent();
		assertThat(op.get().getName()).isEqualTo("category 1");
		
	}
	
	@Test
	@DisplayName("Get all Categories by User's id")
	void findAllByUserId() {
		
		// Given
		User user = testUserRepository.save(User.builder()
				.name("tom")
				.nickname("tommy")
				.email("tom@email.com")
				.age(23)
				.sendAgree(false)
				.newCheck(true)
				.deleted(false)
				.providerType(ProviderType.NAVER)
				.build());
		
		testCategoryRepository.save(
				Category.builder()
						.userId(user.getUserId())
						.name("category 1")
						.build()
		);
		
		testCategoryRepository.save(
				Category.builder()
						.userId(user.getUserId())
						.name("category 2")
						.build()
		);
		
		testCategoryRepository.save(
				Category.builder()
						.userId(12345L)
						.name("category 3")
						.build()
		);
		
		// When
		List<CreateCategoryResDto> list = testCategoryRepository.findAllByUserId(user.getUserId());
		
		// Then
		assertThat(list)
				.hasSize(2)
				.allSatisfy(dto -> assertThat(dto.getName()).isNotEqualTo("category 3"));
		
	}
	
}
