package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.admin.GetOverLimitResDto;
import com.a307.ifIDieTomorrow.domain.dto.admin.GetReportResDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;

import java.util.List;

public interface AdminService {
	List<GetOverLimitResDto> getBucketOrDiaryOverReportLimit() throws UnAuthorizedException;

	List<GetReportResDto> getReportsByTypeAndTypeId(Boolean type, Long typeId) throws UnAuthorizedException, NotFoundException;
}
