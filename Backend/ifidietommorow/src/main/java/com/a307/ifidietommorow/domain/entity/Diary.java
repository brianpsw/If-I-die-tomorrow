package com.a307.ifidietommorow.domain.entity;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@DynamicInsert
@Table(name = "diary")
public class Diary extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    @NotNull
    private Long diaryId;

    @Column
    @NotNull
    private Long userId;

    @Column
    @NotNull
    private String title;

    @Column(columnDefinition = "TEXT")
    @NotNull
    private String content;

//    null 허용
    @Column
    private String image_url;

    @Column
    @NotNull
    @ColumnDefault("false")
    private Boolean secret;

    @Column
    @NotNull
    @ColumnDefault("0")
    private Integer report;


}
