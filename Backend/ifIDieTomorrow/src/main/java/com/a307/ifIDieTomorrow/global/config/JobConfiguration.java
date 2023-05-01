package com.a307.ifIDieTomorrow.global.config;

import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.batch.core.step.tasklet.TaskletStep;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JobConfiguration {

	private final JobBuilderFactory jobBuilderFactory;
	private final StepBuilderFactory stepBuilderFactory;
	private final UserRepository userRepository;

	@Bean
	public Job job(){
		return jobBuilderFactory.get("job")
				.start(step1())
				.build();
	}


	@Bean
	public Step step1(){
		TaskletStep step1 = stepBuilderFactory.get("step1")
				.tasklet((contribution, chunkContext) -> {

					log.info(">>>>> step1");
					List<User> users = userRepository.findAll();

					return RepeatStatus.FINISHED;
				})
				.build();
		step1.setAllowStartIfComplete(true);
		return step1;
	}

	private Boolean wasActiveInLast3Month(User user){

		LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);

		return user.getUpdatedAt().isAfter(threeMonthsAgo);

	}

	private void sendMessage(User user){
		// 알림을 보내는 뭔가
	}

	private Boolean wasActiveInLast6Month(User user){

		LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

		return user.getUpdatedAt().isAfter(sixMonthsAgo);

	}

	private void sendPage(User user){
		// 페이지를 발송하는 뭔가
	}




}
