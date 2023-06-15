package com.a307.ifIDieTomorrow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(
		exclude = {
				org.springframework.cloud.aws.autoconfigure.context.ContextInstanceDataAutoConfiguration.class,
				org.springframework.cloud.aws.autoconfigure.context.ContextStackAutoConfiguration.class,
				org.springframework.cloud.aws.autoconfigure.context.ContextRegionProviderAutoConfiguration.class
		}
)
@EnableJpaAuditing
@EnableScheduling
@EnableAsync
public class IfIDieTomorrowApplication {

	public static void main(String[] args) {
		System.setProperty("server.servlet.context-path", "/api");
		SpringApplication.run(IfIDieTomorrowApplication.class, args);
	}

}
