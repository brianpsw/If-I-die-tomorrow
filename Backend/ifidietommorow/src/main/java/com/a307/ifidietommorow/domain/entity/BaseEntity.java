package com.a307.ifidietommorow.domain.entity;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

/**
 * 생성 / 수정 시각은 공통으로 적용되는 속성이라 baseentity로 빼서 상속 받을 수 있도록 구현했습니다.
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;


    @LastModifiedDate
    @Column // 배치를 통해 수정할 여지가 있어 updatable을 따로 설정하지 않았습니다.
    private LocalDateTime updatedAt;
}
