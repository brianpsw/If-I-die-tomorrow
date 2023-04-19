package com.a307.ifIDieTomorrow.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ifIDieTomorrowApiInfo() {
        return new OpenAPI()
                .info(new Info().title("If I Die Tomorrow API")
                        .description("If I Die Tomorrow")
                        .version("v0.0.1"));
    }
}
