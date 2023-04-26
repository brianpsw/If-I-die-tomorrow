package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.bucket.GetBucketResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.global.auth.ProviderType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class BucketRepositoryTest {
	
	@Autowired
	private BucketRepository testBucketRepository;
	
	@Autowired
	private CommentRepository testCommentRepository;
	
	@Autowired
	private UserRepository testUserRepository;
	
	@AfterEach
	void tearDown() {
		testBucketRepository.deleteAllInBatch();
		testUserRepository.deleteAllInBatch();
		testCommentRepository.deleteAllInBatch();
	}
	
	@Test
	@DisplayName("Get Bucket's info")
	void findByBucketId() {
		
		// Given
		Bucket b = testBucketRepository.save(
				Bucket.builder()
						.userId(1L)
						.title("1-1 title")
						.content("1-1 content")
						.imageUrl("")
						.complete(true)
						.secret(false)
						.report(0)
						.build()
		);
		
		// When
		Optional<Bucket> op = testBucketRepository.findByBucketId(b.getBucketId());
		Optional<Bucket> empty = testBucketRepository.findByBucketId(-1L);
		
		// Then
		assertThat(op).isPresent();
		Bucket bucket = op.get();
		
		assertThat(bucket.getUserId()).isEqualTo(1L);
		assertThat(bucket.getSecret()).isEqualTo(false);
		assertThat(bucket.getComplete()).isEqualTo(true);
		assertThat(bucket.getReport()).isEqualTo(0);
		
		assertThat(empty).isEmpty();
		
	}
	
	@Test
	@DisplayName("Get Bucket and Comments")
	void findAllByUserId() {
		
		// Given
		testBucketRepository.save(
				Bucket.builder()
						.userId(1L)
						.title("1-1 title")
						.content("1-1 content")
						.imageUrl("")
						.complete(false)
						.report(0)
						.secret(false)
						.build()
		);
		
		testBucketRepository.save(
				Bucket.builder()
						.userId(1L)
						.title("1-2 title")
						.content("1-2 content")
						.imageUrl("")
						.complete(true)
						.report(0)
						.secret(false)
						.build()
		);
		
		testBucketRepository.save(
				Bucket.builder()
						.userId(2L)
						.title("2-1 title")
						.content("2-1 content")
						.imageUrl("")
						.complete(false)
						.report(0)
						.secret(true)
						.build()
		);
		
		// When
		List<GetBucketByUserResDto> result1 = testBucketRepository.findAllByUserId(1L);
		List<GetBucketByUserResDto> result2 = testBucketRepository.findAllByUserId(2L);
		
		// Then
		assertThat(result1).hasSize(2);
		assertThat(result2).hasSize(1);
		
		GetBucketByUserResDto dto1 = result1.get(0);
		assertThat(dto1.getTitle()).isEqualTo("1-1 title");
		GetBucketByUserResDto dto2 = result2.get(0);
		assertThat(dto2.getTitle()).isEqualTo("2-1 title");
		
	}
	
	@Test
	@DisplayName("Get Bucket with User's nickname")
	void findByBucketIdWithUserNickName() {
		
		// Given
		User user = testUserRepository.save(
				User.builder()
						.name("tom")
						.nickname("tommy")
						.email("tom@email.com")
						.age(23)
						.sendAgree(false)
						.newCheck(true)
						.deleted(false)
						.providerType(ProviderType.NAVER)
						.build()
		);
		
		Bucket bucket = testBucketRepository.save(
				Bucket.builder()
						.userId(user.getUserId())
						.title("1-1 title")
						.content("1-1 content")
						.imageUrl("")
						.complete(false)
						.report(0)
						.secret(false)
						.build()
		);
		
		// When
		Optional<GetBucketResDto> op = testBucketRepository.findByBucketIdWithUserNickName(bucket.getBucketId());
		
		// Then
		assertThat(op).isPresent();
		GetBucketResDto dto = op.get();
		
		assertThat(dto.getUserId()).isEqualTo(user.getUserId());
		assertThat(dto.getNickname()).isEqualTo(user.getNickname());
		
	}
	
	@Test
	@DisplayName("Get Bucket where secret is false")
	void findAllBySecretIsFalse() {
		
		// Given
		testBucketRepository.save(
				Bucket.builder()
						.userId(1L)
						.title("1-1 title")
						.content("1-1 content")
						.imageUrl("")
						.complete(false)
						.report(0)
						.secret(false)
						.build()
		);
		
		testBucketRepository.save(
				Bucket.builder()
						.userId(1L)
						.title("1-2 title")
						.content("1-2 content")
						.imageUrl("")
						.complete(true)
						.report(0)
						.secret(false)
						.build()
		);
		
		testBucketRepository.save(
				Bucket.builder()
						.userId(2L)
						.title("2-1 title")
						.content("2-1 content")
						.imageUrl("")
						.complete(false)
						.report(0)
						.secret(true)
						.build()
		);
		
		// When
		List<GetBucketResDto> list = testBucketRepository.findAllBySecretIsFalse();
		
		// Then
		for (GetBucketResDto dto : list) {
			assertThat(dto.getSecret()).isEqualTo(false);
		}
		
	}
	
}
