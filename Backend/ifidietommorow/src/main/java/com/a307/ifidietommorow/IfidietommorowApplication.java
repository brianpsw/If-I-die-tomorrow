package com.a307.ifidietommorow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class IfidietommorowApplication {

	public static void main(String[] args) {
		SpringApplication.run(IfidietommorowApplication.class, args);
	}

}
