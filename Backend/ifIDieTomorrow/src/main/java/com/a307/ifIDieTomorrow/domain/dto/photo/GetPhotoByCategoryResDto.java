package com.a307.ifIDieTomorrow.domain.dto.photo;

import com.a307.ifIDieTomorrow.domain.dto.category.CreateCategoryResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetPhotoByCategoryResDto {

	private CreateCategoryResDto category;
	private List<GetPhotoResDto> photos;

}
