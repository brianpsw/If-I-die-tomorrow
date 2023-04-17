package com.a307.ifidietommorow.domain.entity;

import com.sun.istack.NotNull;
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
@Table(name = "receiver")
public class Receiver extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    @NotNull
    private Long receiverId;

    @Column
    @NotNull
    private Long userId;

    @Column
    @NotNull
    private String name;

    @Column
    @NotNull
    private String phoneNumber;
}
