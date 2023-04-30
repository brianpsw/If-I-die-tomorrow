package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface WillService {
	GetWillByUserResDto getWillByUserId () throws NotFoundException;
	
	void createWill(Long userId);
	
	Long createSign (MultipartFile photo) throws NoPhotoException, IOException, IllegalArgumentException;
	
	Long updateContent (String content);
	
	Long updateVideo (MultipartFile video) throws IOException, IllegalArgumentException, NoPhotoException;
	
	Long deleteVideo();
}
