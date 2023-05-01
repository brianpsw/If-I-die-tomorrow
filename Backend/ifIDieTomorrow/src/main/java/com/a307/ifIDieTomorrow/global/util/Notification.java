package com.a307.ifIDieTomorrow.global.util;

import com.a307.ifIDieTomorrow.domain.dto.notification.SmsDto;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;


@Slf4j
@Component
public class Notification {
    @Value("${notification.sms.id}")
    private String smsId;
    @Value("${notification.sms.url}")
    private String smsUrl;
    @Value("${notification.sms.oauth}")
    private String smsOAuth;
    @Value("${notification.sms.apikey}")
    private String smsApiKey;

    private final OkHttpClient client = new OkHttpClient();

    private String getAccessToken() throws IOException {

        String authValue =
                Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
                        smsApiKey).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

        RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("grant_type", "client_credentials")
                .build();

        Request request = new Request.Builder()
                .url(smsOAuth)
                .post(requestBody)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Basic " + authValue)
                .addHeader("cache-control", "no-cache")
                .build();

        // Response 를 key, value 로 확인하실 수 있습니다.
        Response response = client.newCall(request).execute();
        HashMap<String, String> result = new Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
        for(String key : result.keySet()) {
            log.info("{}: {}", key, result.get(key));
        }
        return result.get("access_token");

    }
    @Async
    public void sendSms(SmsDto smsDto) throws IOException {
        String accessToken = getAccessToken();
        String authValue =
                Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
                        accessToken).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

        RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("phone", String.join(",", smsDto.getReceivers())) // 수신번호를 입력해 주세요. (수신번호가 두 개 이상인 경우 ',' 를 이용하여 입력합니다. ex) 01011112222,01033334444)
                .addFormDataPart("callback", smsDto.getCallingNumber()) // 발신번호를 입력해 주세요.
                .addFormDataPart("message", smsDto.getSmsContent()) // SMS 내용을 입력해 주세요.
                .addFormDataPart("refkey", smsDto.getRefKey()) // 발송 결과 조회를 위한 임의의 랜덤 키 값을 입력해 주세요.
                .build();

        Request request = new Request.Builder()
                .url(smsUrl)
                .post(requestBody)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Basic " + authValue)
                .addHeader("cache-control", "no-cache")
                .build();

        Response response = client.newCall(request).execute();

        // Response 를 key, value 로 확인하실 수 있습니다.
        HashMap<String, String> result = new Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
        for (String key : result.keySet()) {
            log.info("{}: {}", key, result.get(key));
        }
    }
}
