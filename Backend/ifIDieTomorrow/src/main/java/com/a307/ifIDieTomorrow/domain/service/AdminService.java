package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.admin.GetOverLimitResDto;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;

import java.util.List;

public interface AdminService {
	List<GetOverLimitResDto> getBucketOrDiaryOverReportLimit() throws UnAuthorizedException;
}
