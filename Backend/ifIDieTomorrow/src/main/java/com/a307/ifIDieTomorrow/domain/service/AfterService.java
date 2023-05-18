package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.global.exception.NotFoundException;

import java.io.IOException;
import java.util.Map;

public interface AfterService {
    Map<String, Object> getData (String pwd) throws NotFoundException;
    Map<String, Object> getMyData () throws NotFoundException;
    String downloadFile (String uuid) throws NotFoundException, IOException;


}
