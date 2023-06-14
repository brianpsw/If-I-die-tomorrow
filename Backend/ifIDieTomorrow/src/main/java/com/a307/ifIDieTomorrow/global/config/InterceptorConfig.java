package com.a307.ifIDieTomorrow.global.config;

import com.a307.ifIDieTomorrow.global.aop.FileDelete;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
@RequiredArgsConstructor
public class InterceptorConfig implements WebMvcConfigurer {
    private final FileDelete fileDelete;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(fileDelete).addPathPatterns("/after/download");
    }
}
