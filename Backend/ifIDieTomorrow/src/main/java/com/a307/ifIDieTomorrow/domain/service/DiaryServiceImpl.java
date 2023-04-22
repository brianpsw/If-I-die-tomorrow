package com.a307.ifIDieTomorrow.domain.service;

import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryReqDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.CreateDiaryResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryByUserResDto;
import com.a307.ifIDieTomorrow.domain.entity.Diary;
import com.a307.ifIDieTomorrow.domain.repository.CommentRepository;
import com.a307.ifIDieTomorrow.domain.repository.DiaryRepository;
import com.a307.ifIDieTomorrow.domain.repository.UserRepository;
import com.a307.ifIDieTomorrow.global.exception.IllegalArgumentException;
import com.a307.ifIDieTomorrow.global.exception.NoPhotoException;
import com.a307.ifIDieTomorrow.global.exception.NotFoundException;
import com.a307.ifIDieTomorrow.global.util.S3Upload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
	private final UserRepository userRepository;
	private final DiaryRepository diaryRepository;
	private final CommentRepository commentRepository;

	@Override
	public CreateDiaryResDto createDiary(CreateDiaryReqDto req, MultipartFile photo) throws IOException, NotFoundException, NoPhotoException, IllegalArgumentException {

//		이후 jwt 적용 시 해당 부분은 생략합니다. (유저아이디는 토큰에서 받아옴)
		if (!userRepository.existsByUserId(req.getUserId())) throw new NotFoundException("존재하지 않는 유저입니다.");

//		사진 검증
		if (req.getHasPhoto() && photo.isEmpty()) throw new NoPhotoException("사진이 업로드 되지 않았습니다.");


		return CreateDiaryResDto.toDto(
				diaryRepository.save(Diary.builder()
								.title(req.getTitle())
								.userId(req.getUserId())
								.content(req.getContent())
								.secret(req.getSecret())
								.imageUrl(req.getHasPhoto() ? s3Upload.uploadFiles(photo, "diary") : "")
								.build()
				)
		);
	}

	@Override
	public List<GetDiaryByUserResDto> getDiaryByUserId(Long userId) throws NotFoundException {

		if (!userRepository.existsByUserId(userId)) throw new NotFoundException("존재하지 않는 유저입니다.");

		return diaryRepository.findAllByUserIdWithCommentCount(userId);
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
}
