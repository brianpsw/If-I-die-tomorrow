package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.UpdateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.global.auth.UserPrincipal;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.exception.UnAuthorizedException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DiaryServiceImpl implements DiaryService{

	private final S3Upload s3Upload;
	private final DiaryRepository diaryRepository;
	private final CommentRepository commentRepository;

	@Override
	public CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NoPhotoException, IllegalArgumentException {

//
//		사진 검증
		if (req.getHasPhoto() && (photo == null || photo.isEmpty())) throw new NoPhotoException("올리고자 하는 사진이 없습니다");


		return CreateDiaryResDto.toDto(
				diaryRepository.save(Diary.builder()
								.title(req.getTitle())
								.userId(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId())
								.content(req.getContent())
								.secret(req.getSecret())
								.report(0)
								.imageUrl(req.getHasPhoto() ? s3Upload.uploadFiles(photo, "diary") : "")
								.build()
				)
		);
	}

	@Override
	public List<GetDiaryByUserResDto> getDiaryByUserId() {

		return diaryRepository.findAllByUserIdWithCommentCount(((UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
	}

	@Override
	public HashMap<String, Object> getDiaryById(Long diaryId) throws NotFoundException {

		return diaryRepository.findByIdWithUserNickName(diaryId)
				.map(dto -> {

//					다이어리 내용과 댓글을 해쉬맵 형태로 반환합니다.
					HashMap<String, Object> result  = new HashMap<>();
					result.put("diary", dto);
					result.put("comments", commentRepository.findCommentsByTypeId(diaryId, true));

					return result;
				})
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 아이디입니다!"));

	}
	@Override
	public Long deleteDiaryByDiaryId(Long diaryId) throws NotFoundException {

		Diary diary = diaryRepository.findById(diaryId)
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 아이디입니다!"));

//		사진 삭제
		if (!"".equals(diary.getImageUrl())) s3Upload.fileDelete(diary.getImageUrl());

//		댓글 삭제
		commentRepository.deleteAllInBatch(commentRepository.findAllByTypeIdAndType(diaryId, true));

//		다이어리 삭제
		diaryRepository.delete(diary);

		return diaryId;
	}

	@Override
	public CreateDiaryResDto updateDiary(UpdateDiaryReqDto req, MultipartFile photo) throws NotFoundException, IOException, IllegalArgumentException, UnAuthorizedException {
		Diary diary = diaryRepository.findById(req.getDiaryId())
				.orElseThrow(() -> new NotFoundException("잘못된 다이어리 id 입니다!"));

		//		유저 정보 파싱
		UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Long userId = principal.getUserId();

		if (!userId.equals(diary.getUserId())) throw new UnAuthorizedException("내가 작성한 다이어리가 아닙니다");


//		기존 사진 삭제
		if (req.getUpdatePhoto() && !"".equals(diary.getImageUrl())) s3Upload.fileDelete(diary.getImageUrl());

		diary.updateDiary(
				req.getTitle(),
				req.getContent(),
				req.getUpdatePhoto() && photo != null ? s3Upload.uploadFiles(photo, "diary") : "",
				req.getSecret()
		);

		return CreateDiaryResDto.toDto(diaryRepository.save(diary));
	}
}
