package com.a307.ifIDieTomorrow.domain.controller;

import com.a307.ifIDieTomorrow.domain.dto.comment.CreateCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;
import com.a307.ifIDieTomorrow.domain.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@Tag(name = "알림", description = "APIs for NOTIFICATION")
@RequestMapping("/notification")
@Slf4j
@RequiredArgsConstructor
@RestController
public class NotificationController {
    private final NotificationService notificationService;
    @GetMapping("")
    @Operation(summary = "나에게 온 알림 리스트", description = "나에게 온 알림 리스트를 불러옵니다.")
    public ResponseEntity<GetPageDto> getNotificationByUserId(
            @RequestParam(name = "page", required = false) Integer pageNo,
            @RequestParam(name = "size", required = false) Integer pageSize
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(notificationService.getNotificationByUserId(pageNo, pageSize));
    }

    @GetMapping("/count")
    @Operation(summary = "나에게 온 알림 개수", description = "내가 마지막으로 확인한 후 알림 개수를 불러옵니다.")
    public ResponseEntity<Long> getNotificationCount() {
        return ResponseEntity.status(HttpStatus.OK).body(notificationService.getNotificationCount());
    }

}
