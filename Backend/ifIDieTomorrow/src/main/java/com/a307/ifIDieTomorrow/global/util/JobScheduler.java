package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.global.config.JobConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobParameter;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
public class JobScheduler {

	@Autowired
	private JobLauncher jobLauncher;
	
	@Autowired
	private JobConfiguration jobConfiguration;

	
	// cron = "0 0 8 * * *" -> 매일 오전 8시에 스케줄러 작동
	@Scheduled(cron = "${SMS_TIME}")
	public void runJob() throws JobInstanceAlreadyCompleteException, JobExecutionAlreadyRunningException, JobParametersInvalidException, JobRestartException {
		
		log.info("스케줄러 작동, 현재 시간 : " + LocalDateTime.now());
		// 매번 다른 매개변수를 전달해야 함
		Map<String, JobParameter> confMap = new HashMap<>();
		confMap.put("time", new JobParameter(System.currentTimeMillis()));
		JobParameters jobParameters = new JobParameters(confMap);
		
		jobLauncher.run(jobConfiguration.job(), jobParameters);
		
	}

}
