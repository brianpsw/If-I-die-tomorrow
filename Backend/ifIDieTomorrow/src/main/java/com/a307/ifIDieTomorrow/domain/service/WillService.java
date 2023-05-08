package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.will.GetWillByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.will.UpdateWillContentDto;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface WillService {
	GetWillByUserResDto getWillByUserId () throws NotFoundException;
	
	void createWill(Long userId);
	
	Long createSign (MultipartFile photo) throws NoPhotoException, IOException, IllegalArgumentException, ImageProcessingException, MetadataException;
	
	Long updateContent (UpdateWillContentDto data);
	
	Long updateVideo (MultipartFile video) throws IOException, IllegalArgumentException, NoPhotoException, ImageProcessingException, MetadataException;
	
	Long deleteVideo();
}
