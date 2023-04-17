package com.a307.ifidietommorow.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private Boolean sendAgree;

    @Column // 비동의 시 null로?
    private String personalPage;

    @Column // 가입 이후 검사 전까지는 null
    private Long personalityId;

    @Column(nullable = false)
    private Boolean newCheck;

    @Column(nullable = false)
    private Boolean deleted;

//    토큰 관련 부분은 확실하지 않아서 작성하고 주석처리했습니다.
//    @Column
//    private String refreshToken;


}
