package com.a307.ifIDieTomorrow.global.auth;

import java.util.Map;

public class KakaoOAuth2UserInfo extends OAuth2UserInfo{
    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return (String) attributes.get("id");
    }

    @Override
    public String getName() {
        return (String) ((Map<String, Object>) attributes.get("properties")).get("nickname");
    }

    @Override
    public String getEmail() {
        return (String) ((Map<String, Object>) attributes.get("kakao_account")).get("email");
    }

    @Override
    public Integer getAge() {
        String age = (String) ((Map<String, Object>) attributes.get("kakao_account")).getOrDefault("age_range", null);
        return age == null ? 0 : Integer.parseInt(age.substring(0, age.indexOf("~")));
    }
}
