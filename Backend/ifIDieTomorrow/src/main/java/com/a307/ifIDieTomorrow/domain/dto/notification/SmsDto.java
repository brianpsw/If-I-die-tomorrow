package com.a307.ifIDieTomorrow.domain.dto.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SmsDto {

    private String receiver;
    private String smsContent;
<<<<<<< Updated upstream
    private String refKey;

}
=======
}
>>>>>>> Stashed changes
