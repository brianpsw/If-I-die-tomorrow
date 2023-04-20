package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public interface DiaryService {

	CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NotFoundException;

	List<GetDiaryByUserResDto> getDiaryByUserId(Long userId) throws NotFoundException;

	HashMap<String, Object> getDiaryById(Long diaryId) throws NotFoundException;
}
