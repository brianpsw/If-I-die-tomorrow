package com.a307.ifIDieTomorrow.domain.repository;

import com.a307.ifIDieTomorrow.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {

	Boolean existsByUserId(Long userId);

	@Query("SELECT u.nickname " +
			"FROM User u " +
			"WHERE u.userId = :userId")
	String findUserNickNameByUserId(@Param("userId") Long userId);

    Optional<User> findByEmail(String email);
	
//	@Query("SELECT u " +
//			"FROM User u " +
//			"WHERE u.sendAgree = true")
//	List<User> findAllUsersWhereSendAgreeIsTrue();
	
	List<User> findAllBySendAgreeIsTrueAndPersonalPageIsNullAndUpdatedAtIsBefore(LocalDateTime localDateTime);
	
	@Query("SELECT u " +
			"FROM User u " +
			"WHERE u.deleted = true")
	List<User> findAllUsersWhereDeletedIsTrue ();
}
