package com.a307.ifIDieTomorrow.global.config;

import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.step.tasklet.TaskletStep;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
@Slf4j
@EnableBatchProcessing
public class JobConfiguration {

	private final JobBuilderFactory jobBuilderFactory;
	private final StepBuilderFactory stepBuilderFactory;
	private final UserRepository userRepository;

	@Bean
	public Job job(){
		return jobBuilderFactory.get("job")
				.start(processUser())
				.next(finished())
				.build();
	}

	@Bean
	public Step processUser(){
		TaskletStep processUser = stepBuilderFactory.get("processUser")
				.tasklet((contribution, chunkContext) -> {

					log.info(">>>>> step processUser starts");

					/**
					 * 1. 사후 페이지가 없는 유저
					 */
					log.info(">>>>> 1.1: Fetch all users agreed to send service");
					List<User> users = userRepository.findAllUsersWhereSendAgreeIsTrue()
							.stream()
							.filter(user -> user.getPersonalPage() == null)
							.collect(Collectors.toList());

					log.info("fetched {} users to process", users.size());

					/**
					 * 2. 6개월 이상 활동 안 한 유저
					 */
					log.info(">>>>> 1.2: six months ago");
					LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

					users.parallelStream()
							.filter(user -> user.getUpdatedAt().isBefore(sixMonthsAgo))
							.forEach(this::sendPage);

					/**
					 * 3. 3개월 ~ 6개월 간 활동 안 한 유저
					 */
					log.info(">>>>> 1.3: three months ago");

					LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);

					users.parallelStream()
							.filter(user -> user.getUpdatedAt().isAfter(sixMonthsAgo) && user.getUpdatedAt().isBefore(threeMonthsAgo))
							.forEach(this::sendNotice);

					return RepeatStatus.FINISHED;
				})
				.build();
		processUser.setAllowStartIfComplete(true);
		return processUser;
	}

	@Bean
	public Step finished(){
		return stepBuilderFactory.get("finished")
				.tasklet((contribution, chunkContext) -> {
					log.info("task finished at {}", LocalDateTime.now());
					return RepeatStatus.FINISHED;
				}).build();
	}

	private void sendNotice(User user){
		// 알림을 보내는 뭔가
		log.info("send Notice to {}", user.getNickname());
	}

	private void sendPage(User user){
		// 페이지를 발송하는 뭔가
		log.info("send Page to receivers of {}", user.getNickname());
	}


}
