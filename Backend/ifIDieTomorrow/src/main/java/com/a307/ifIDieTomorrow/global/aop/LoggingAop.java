package com.a307.ifIDieTomorrow.global.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

@Slf4j
@Aspect
@Component
public class LoggingAop {

//	적용 범위
	@Pointcut("execution(* com.a307.ifIDieTomorrow.domain.controller..*.*(..))")
	private void cut(){}

	@Before("cut()")
	public void logBefore(JoinPoint joinPoint){

		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();

		log.info("=========================Request Info=========================");
		log.info("Request Path: {}", request.getServletPath());
		log.info("Method: {}", joinPoint.getSignature().getName());
		log.info("HTTP Method: {}", request.getMethod());
		log.info("Remote Host: {}", request.getRemoteHost());
		log.info("Remote User: {}", request.getRemoteUser());
		log.info("Arguments: {}", Arrays.toString(joinPoint.getArgs()));

	}


	@AfterReturning(value = "cut()", returning = "returnObj")
	public void logAfterReturn(JoinPoint joinPoint, Object returnObj){

		log.info("=========================Response Info=========================");
		log.info("Response: {}", returnObj.toString());
	}



	@Around("cut()")
	public Object logAround (ProceedingJoinPoint proceedingJoinPoint) throws Throwable {

		log.info("******************************LOG STARTS******************************");


//		수행 시간
		Long start = System.currentTimeMillis();
		Object result = proceedingJoinPoint.proceed();
		Long end = System.currentTimeMillis();

		log.info("executed in {}ms", end - start);


		log.info("*******************************LOG ENDS*******************************");
		return result;

	}

}
