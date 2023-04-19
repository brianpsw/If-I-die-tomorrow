package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryServiceImpl implements DiaryService{

	private final S3Upload s3Upload;
	private final UserRepository userRepository;
	private final DiaryRepository diaryRepository;

	@Override
	public CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NotFoundException {

//		이후 jwt 적용 시 해당 부분은 생략합니다. (유저아이디는 토큰에서 받아옴)
		if (userRepository.existsByUserId(req.getUserId())) throw new NotFoundException("존재하지 않는 유저입니다.");

		return CreateDiaryResDto.toDto(Diary.builder()
						.title(req.getTitle())
						.content(req.getContent())
						.secret(req.getSecret())
						.imageUrl(req.getHasPhoto() ? s3Upload.uploadFiles(photo, "diary") : "")
						.build()
		);
	}

	@Override
	public List<GetDiaryResDto> getDiaryByUserId(Long userId) throws NotFoundException {

		if (userRepository.existsByUserId(userId)) throw new NotFoundException("존재하지 않는 유저입니다.");

		return diaryRepository.findAllByUserIdWithCommentCount(userId);
	}
}
