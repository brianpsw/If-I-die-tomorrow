package com.a307.ifIDieTomorrow.global.aop;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.stream.Stream;

@Slf4j
@Component
public class FileDelete implements HandlerInterceptor {

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        String fileName = (String) request.getAttribute("fileName");
        try{
            Files.delete(Paths.get(fileName));
            Files.walk(Paths.get((String) fileName.subSequence(0, fileName.lastIndexOf('.'))))
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        }catch (Exception e){
            log.error(e.getMessage());
        };
        try (Stream<Path> stream = Files.walk(Paths.get((String) fileName.subSequence(0, fileName.lastIndexOf('.'))))) {
            stream
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(File::delete);
        } catch (IOException e) {
            // Handle any potential IOException here
            log.error(e.getMessage());
        }
    }
}
