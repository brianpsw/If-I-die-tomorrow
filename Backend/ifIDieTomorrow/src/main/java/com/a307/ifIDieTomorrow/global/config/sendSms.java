package com.a307.ifIDieTomorrow.global.config;

import com.google.gson.Gson;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;



public class sendSMS {
    public static final String SMS_SEND_URL = "https://sms.gabia.com/api/send/sms"; // SMS 발송 API URL


    public static void main(String[] args) throws IOException {
        String smsId = "YOUR_SMS_ID"; // SMS ID 를 입력해 주세요.
        String accessToken = "YOUR_ACCESS_TOKEN"; // ACCESS TOKEN 을 입력해 주세요.
        String authValue =
                Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
                        accessToken).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

        // SMS 발송 API 를 호출합니다.
        OkHttpClient client = new OkHttpClient();

        RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("phone", "RECEIPT_PHONE_NUMBER") // 수신번호를 입력해 주세요. (수신번호가 두 개 이상인 경우 ',' 를 이용하여 입력합니다. ex) 01011112222,01033334444)
                      .addFormDataPart("callback", "CALLING_PHONE_NUMBER") // 발신번호를 입력해 주세요.
                .addFormDataPart("message", "SMS_CONTENT") // SMS 내용을 입력해 주세요.
                .addFormDataPart("refkey", "YOUR_REF_KEY") // 발송 결과 조회를 위한 임의의 랜덤 키 값을 입력해 주세요.
                .build();

        Request request = new Request.Builder()
                .url(SMS_SEND_URL)
                .post(requestBody)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Basic " + authValue)
                .addHeader("cache-control", "no-cache")
                .build();

        Response response = client.newCall(request).execute();

        // Response 를 key, value 로 확인하실 수 있습니다.
        HashMap<String, String> result = new
                Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
        for(String key : result.keySet()) {
            System.out.printf("%s: %s%n", key, result.get(key));
        }
    }
}