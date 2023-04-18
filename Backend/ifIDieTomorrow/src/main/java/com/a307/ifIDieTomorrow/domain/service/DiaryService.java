package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.DiaryCreateReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.DiaryCreateResDto;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface DiaryService {

	DiaryCreateResDto createDiary(DiaryCreateReqDto req, MultipartFile photo) throws IOException, NotFoundException;

}
