package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.domain.dto.notification.SmsDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class NotificationTest {

    @Autowired
    private Notification notification;
    @Test
    void sendSms() throws IOException {
        SmsDto smsDto = SmsDto.builder().smsContent("IfIDieTomorrow 테스트").receiver("전화번호").build();
        notification.sendSms(smsDto);
    }
}