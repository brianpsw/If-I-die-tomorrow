package com.a307.ifIDieTomorrow.global.config;

import com.a307.ifIDieTomorrow.domain.service.UserServiceImpl;
import com.a307.ifIDieTomorrow.global.auth.OAuth2AuthenticationFailureHandler;
import com.a307.ifIDieTomorrow.global.auth.OAuth2AuthenticationSuccessHandler;
import com.a307.ifIDieTomorrow.global.auth.OAuth2AuthorizationRequestBasedOnCookieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserServiceImpl oAuth2UserService;
    private final CorsProperties corsProperties;
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
    private final OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository;
    @Bean

    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(withDefaults())
            .csrf().disable()
            .authorizeRequests(authorize -> authorize
                    .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
//                    .loginPage("https://ifidietomorrow.co.kr/login")
                    .authorizationEndpoint().authorizationRequestRepository(oAuth2AuthorizationRequestBasedOnCookieRepository)
                    .and()
                    .userInfoEndpoint(userInfo -> userInfo
                            .userService(oAuth2UserService))
//                    .successHandler(oAuth2AuthenticationSuccessHandler)
                    .failureHandler(oAuth2AuthenticationFailureHandler));


        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(corsProperties.getAllowedOrigins().split(",")));
        configuration.setAllowedMethods(Arrays.asList(corsProperties.getAllowedMethods().split(",")));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


}
