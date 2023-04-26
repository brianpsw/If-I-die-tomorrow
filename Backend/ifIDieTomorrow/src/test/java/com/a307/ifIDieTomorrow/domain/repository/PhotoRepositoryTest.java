package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.photo.GetPhotoResDto;
import com.a307.ifIDieTomorrow.domain.entity.Category;
import com.a307.ifIDieTomorrow.domain.entity.Photo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class PhotoRepositoryTest {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private PhotoRepository photoRepository;
	
	@AfterEach
	void tearDown() {
		userRepository.deleteAllInBatch();
		photoRepository.deleteAllInBatch();
		categoryRepository.deleteAllInBatch();
	}
	
	@Test
	@DisplayName("Get all Photo by Category's id")
	void findAllPhotoByCategory_CategoryId() {
		// Given
		Category category1 = categoryRepository.save(
				Category.builder()
						.userId(1L)
						.name("category1")
						.build()
		);
		
		Category category2 = categoryRepository.save(
				Category.builder()
						.userId(1L)
						.name("category2")
						.build()
		);
		
		photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo1")
						.build()
		);
		
		photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo2")
						.build()
		);
		
		// When
		List<GetPhotoResDto> list1 = photoRepository.findAllPhotoByCategory_CategoryId(category1.getCategoryId());
		List<GetPhotoResDto> list2 = photoRepository.findAllPhotoByCategory_CategoryId(category2.getCategoryId());
		
		// Then
		assertThat(list1).hasSize(2);
		assertThat(list2).hasSize(0);
		
	}
	
	@Test
	@DisplayName("Delete all Photo by Category's id")
	void deleteAllByCategory_CategoryId() {
		// Given
		Category category1 = categoryRepository.save(
				Category.builder()
						.userId(1L)
						.name("category1")
						.build()
		);
		
		photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo1")
						.build()
		);
		
		photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo2")
						.build()
		);
		
		// When
		photoRepository.deleteAllByCategory_CategoryId(category1.getCategoryId());
		List<GetPhotoResDto> list = photoRepository.findAllPhotoByCategory_CategoryId(category1.getCategoryId());
		
		
		// Then
		assertThat(list).hasSize(0);
		
	}
	
	@Test
	@DisplayName("Get Photo by Photo's id")
	void findByPhotoId() {
		// Given
		Category category1 = categoryRepository.save(
				Category.builder()
						.userId(1L)
						.name("category1")
						.build()
		);
		
		Photo photo1 = photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo1")
						.build()
		);
		
		Photo photo2 = photoRepository.save(
				Photo.builder()
						.category(category1)
						.userId(1L)
						.imageUrl("")
						.caption("photo2")
						.build()
		);
		
		// When
		Optional<Photo> op = photoRepository.findByPhotoId(photo1.getPhotoId());
		
		// Then
		assertThat(op).isPresent();
		
		Photo photo = op.get();
		assertThat(photo.getPhotoId()).isEqualTo(photo1.getPhotoId());
		assertThat(photo.getPhotoId()).isNotEqualTo(photo2.getPhotoId());
		assertThat(photo.getCategory().getCategoryId()).isEqualTo(category1.getCategoryId());
		
	}
	
}
