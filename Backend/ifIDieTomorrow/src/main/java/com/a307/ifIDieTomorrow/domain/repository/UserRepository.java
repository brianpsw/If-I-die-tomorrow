package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

	Boolean existsByUserId(Long userId);


	@Query("SELECT u.nickname " +
			"FROM User u " +
			"WHERE u.userId = :userId")
	String findUserNickNameByUserId(@Param("userId") Long userId);


    Optional<User> findByEmail(String email);

}
