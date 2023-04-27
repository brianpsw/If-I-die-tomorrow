package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.global.exception.NotFoundException;

import java.util.Map;

public interface AfterService {
    Map<String, Object> getData (String pwd) throws NotFoundException;
}
