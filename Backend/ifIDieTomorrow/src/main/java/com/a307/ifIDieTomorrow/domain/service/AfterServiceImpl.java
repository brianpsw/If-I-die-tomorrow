package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.entity.After;
import com.a307.ifIDieTomorrow.domain.repository.*;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class AfterServiceImpl implements AfterService{
    private final AfterRepository afterRepository;
    private final BucketRepository bucketRepository;
    private final DiaryRepository diaryRepository;
    private final PhotoService photoService;
    private final WillRepository willRepository;

    @Override
    public Map<String, Object> getData(String pwd) throws NotFoundException {
        After after = afterRepository.findByUuid(pwd).orElseThrow(() -> new NotFoundException("사후 페이지가 존재하지 않습니다."));
        HashMap<String, Object> result = new HashMap<>();
        result.put("photos", photoService.getPhotoByUser(after.getUserId()));
        result.put("diaries", diaryRepository.findAllByUserIdIdWithUserNickName(after.getUserId()));
        result.put("buckets", bucketRepository.findAllByUserIdWithUserNickName(after.getUserId()));
        result.put("will", willRepository.getByUserId(after.getUserId()));
        return result;
    }

    @Override
    public Map<String, Object> getMyData() throws NotFoundException {
        HashMap<String, Object> result = new HashMap<>();
        result.put("photos", photoService.getPhotoByUser(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("diaries", diaryRepository.findAllByUserIdIdWithUserNickName(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("buckets", bucketRepository.findAllByUserIdWithUserNickName(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        result.put("will", willRepository.getByUserId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId()));
        return result;
    }
}
