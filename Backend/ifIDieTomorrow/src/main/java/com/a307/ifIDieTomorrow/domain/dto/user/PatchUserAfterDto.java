package com.a307.ifIDieTomorrow.domain.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatchUserAfterDto {

    private Boolean agree;
    private String phone;

}
