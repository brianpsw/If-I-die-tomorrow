package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.service.AfterService;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Tag(name = "사후 페이지", description = "APIs for AFTER")
@RestController
@RequiredArgsConstructor
@RequestMapping("/after")
public class AfterController {
    private final AfterService afterService;

    @PostMapping()
    @Operation(summary = "사후 페이지 전송", description = "사후 페이지 데이터를 전송받음.")
    public ResponseEntity<Map<String, Object>> getData(
            @RequestBody Map<String, String> passwordMap) throws NotFoundException {
        return ResponseEntity.status(HttpStatus.OK).body(afterService.getData(passwordMap.get("pwd")));
    }
}
