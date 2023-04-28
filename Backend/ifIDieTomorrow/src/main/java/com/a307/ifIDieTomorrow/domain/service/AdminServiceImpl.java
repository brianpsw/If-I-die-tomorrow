package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.admin.GetOverLimitResDto;
import com.a307.ifIDieTomorrow.domain.entity.Bucket;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.repository.BucketRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.RoleType;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.AdminUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService{

	private final BucketRepository bucketRepository;
	private final DiaryRepository diaryRepository;
	private final AdminUtil adminUtil;


	@Override
	public List<GetOverLimitResDto> getBucketOrDiaryOverReportLimit() throws UnAuthorizedException {

//		권한 확인
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (!principal.getRoleType().equals(RoleType.ADMIN)) throw new UnAuthorizedException("권한이 없습니다!");

		List<GetOverLimitResDto> result = new ArrayList<>();

//		다이어리/버킷
		List<Diary> diaryList = diaryRepository.findAllByReportGreaterThanEqual(adminUtil.MAX_REPORT);
		List<Bucket> bucketList = bucketRepository.findAllByReportIsGreaterThanEqual(adminUtil.MAX_REPORT);

//		dto로 변환
		result.addAll(diaryList.stream()
				.map(GetOverLimitResDto::toDto)
				.collect(Collectors.toList()));

		result.addAll(bucketList.stream()
				.map(GetOverLimitResDto::toDto)
				.collect(Collectors.toList()));

//		신고 많은 순서로 정렬해서 반환
		return result.stream()
				.sorted(Comparator.comparingInt(GetOverLimitResDto::getReport).reversed())
				.collect(Collectors.toList());

	}
}
