package com.a307.ifIDieTomorrow.global.config;

import com.a307.ifIDieTomorrow.domain.dto.notification.SmsDto;
import com.a307.ifIDieTomorrow.domain.entity.User;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.util.Notification;
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

import java.io.IOException;
import java.time.Duration;
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
	private final Notification notification;

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

	private void sendNotice(User user)  {
		// 알림을 보내는 뭔가
		StringBuilder content = new StringBuilder();
		content.append("[If I Die Tomorrow]").append("\n");
		content.append(user.getName()).append("님, ").append("\n");
		content.append("접속하신지 ").append( Duration.between(user.getUpdatedAt(), LocalDateTime.now()).toDays()).append("일 지났습니다.").append("\n");
		content.append("미접속 6개월 이상 지속시 사망으로 간주하여 등록된 수신자에게 사후전송 페이지가 전송됩니다.").append("\n");
		content.append("www.ifidietomorrow.co.kr/login").append(" 에 ").append("KAKAO".equals(user.getProviderType().toString()) ? "카카오" : "네이버").append(" 계정으로 로그인 해주세요.").append("\n");


		try {
			notification.sendSms(SmsDto.builder().smsContent(content.toString()).receiver(user.getPhone()).build());
		} catch (IOException e) {
			log.error(e.getMessage());
		}
		log.info("send Notice to {}", user.getNickname());
	}

	private void sendPage(User user){
		// 페이지를 발송하는 뭔가
		log.info("send Page to receivers of {}", user.getNickname());
	}


}
