package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.community.GetPageDto;

public interface NotificationService {
    public GetPageDto getNotificationByUserId(Integer pageNo, Integer pageSize);
    public Long getNotificationCount();
}
