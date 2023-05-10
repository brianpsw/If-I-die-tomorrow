package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.*;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import com.opencsv.exceptions.CsvException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

public interface DiaryService {

	CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NotFoundException, NoPhotoException, IllegalArgumentException, ImageProcessingException, MetadataException;

	List<GetDiaryByUserResDto> getDiaryByUserId();

	HashMap<String, Object> getDiaryById(Long diaryId) throws NotFoundException, UnAuthorizedException;

	Long deleteDiaryByDiaryId(Long diaryId) throws NotFoundException, UnAuthorizedException;

	CreateDiaryResDto updateDiary(UpdateDiaryReqDto req, MultipartFile photo) throws NotFoundException, IOException, IllegalArgumentException, UnAuthorizedException, ImageProcessingException, MetadataException;
	
	FamousSayingDto getFamousSaying () throws IOException, CsvException;
}
