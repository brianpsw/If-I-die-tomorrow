package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.*;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.FamousSayingGenerator;
import com.a307.ifIDieTomorrow.global.util.FileChecker;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.MetadataException;
import com.opencsv.exceptions.CsvException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryServiceImpl implements DiaryService{

	private final S3Upload s3Upload;
	private final DiaryRepository diaryRepository;
	private final CommentRepository commentRepository;
	private final FamousSayingGenerator famousSayingGenerator;

	@Override
	public CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NoPhotoException, ImageProcessingException, MetadataException, IllegalArgumentException {

		if(req.getContent() == null || "".equals(req.getContent().trim())) throw new IllegalArgumentException("내용이 없습니다.");
		if(req.getTitle() == null || "".equals(req.getTitle().trim())) throw new IllegalArgumentException("제목이 없습니다.");
//
//		사진 검증
		if (req.getHasPhoto() && (photo == null || photo.isEmpty())) throw new NoPhotoException("올리고자 하는 사진이 없습니다");
		
		String type = null;
		if (photo != null) {
			if (FileChecker.videoCheck(FileChecker.getMimeType(photo.getInputStream()))) type = "video";
			else type = "image";
		}

		return CreateDiaryResDto.toDto(
				diaryRepository.save(Diary.builder()
								.title(req.getTitle())
								.userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
								.content(req.getContent())
								.secret(req.getSecret())
								.report(0)
								.imageUrl(req.getHasPhoto() ? s3Upload.upload(photo, "diary") : "")
								.imageType(type)
								.build()
				)
		);
	}

	@Override
	public List<GetDiaryByUserResDto> getDiaryByUserId() {

		return diaryRepository.findAllByUserIdWithCommentCount(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
	}

	@Override
	public HashMap<String, Object> getDiaryById(Long diaryId) throws NotFoundException, UnAuthorizedException {


		GetDiaryResDto diary = diaryRepository.findByIdWithUserNickName(diaryId).orElseThrow(() -> new NotFoundException("잘못된 다이어리 ID 입니다!"));
		if (diary.getSecret() && diary.getUserId() != ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
			throw new UnAuthorizedException("해당 다이어리에 접근하기 위한 권한이 없습니다.");
		HashMap<String, Object> result  = new HashMap<>();
		result.put("diary", diary);
		result.put("comments", commentRepository.findCommentsByTypeId(diaryId, true));

		return result;


	}
	@Override
	public Long deleteDiaryByDiaryId(Long diaryId) throws NotFoundException, UnAuthorizedException {

		Diary diary = diaryRepository.findById(diaryId)
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 아이디입니다!"));
		
		if (diary.getUserId() != ((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
			throw new UnAuthorizedException("삭제 권한이 없습니다.");
		
//		사진 삭제
		if (!"".equals(diary.getImageUrl())) s3Upload.delete(diary.getImageUrl());

//		댓글 삭제
		commentRepository.deleteAllInBatch(commentRepository.findAllByTypeIdAndType(diaryId, true));

//		다이어리 삭제
		diaryRepository.delete(diary);

		return diaryId;
	}

	@Override
	public CreateDiaryResDto updateDiary(UpdateDiaryReqDto req, MultipartFile photo) throws NotFoundException, IOException, UnAuthorizedException, ImageProcessingException, MetadataException, IllegalArgumentException {
		Diary diary = diaryRepository.findById(req.getDiaryId())
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 id 입니다!"));

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

		if (!userId.equals(diary.getUserId())) throw new UnAuthorizedException("내가 작성한 다이어리가 아닙니다");

		if(req.getContent() == null || "".equals(req.getContent().trim())) throw new IllegalArgumentException("내용이 없습니다.");
		if(req.getTitle() == null || "".equals(req.getTitle().trim())) throw new IllegalArgumentException("제목이 없습니다.");

//		기존 사진 삭제
		if (req.getUpdatePhoto() && diary.getImageUrl() != null && !"".equals(diary.getImageUrl())) s3Upload.delete(diary.getImageUrl());
		
		String type = null;
		if (photo != null) {
			if (FileChecker.videoCheck(FileChecker.getMimeType(photo.getInputStream()))) type = "video";
			else type = "image";
		}

		diary.updateDiary(
				req.getTitle(),
				req.getContent(),
				req.getUpdatePhoto() ? (photo == null ? "" : s3Upload.upload(photo, "diary")) : diary.getImageUrl(),
				req.getSecret(),
				req.getUpdatePhoto() ? type : diary.getImageType()
		);

		return CreateDiaryResDto.toDto(diaryRepository.save(diary));
	}
	
	@Override
	public FamousSayingDto getFamousSaying () throws IOException, CsvException {
		return famousSayingGenerator.getRandomItemFromCsv();
	}
}
