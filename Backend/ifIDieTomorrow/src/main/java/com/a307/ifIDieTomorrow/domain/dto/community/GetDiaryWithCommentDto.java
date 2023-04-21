package com.a307.ifIDieTomorrow.domain.dto.community;

import com.a307.ifIDieTomorrow.domain.dto.comment.GetCommentResDto;
import com.a307.ifIDieTomorrow.domain.dto.diary.GetDiaryResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetDiaryWithCommentDto {

	private GetDiaryResDto diary;
	private List<GetCommentResDto> comments;

}
