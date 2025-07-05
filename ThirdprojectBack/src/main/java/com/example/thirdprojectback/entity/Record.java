package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 회원 ID, 연관관계로 맵핑하고 싶다면 아래 주석 참고
    @Column(nullable = false)
    private Long userId;

    private Float sleep;        // 수면 시간 (예: 7.5시간)

    private Long weight;        // 몸무게

    private Double fat;         // 지방

    private Double muscle;      // 골격근량

    private Double bmr;         // 기초대사량

    private Double bmi;         // 체질량지수

    private Double vai;         // 내장지방지수

    @Column(nullable = false)
    private LocalDate date;     // 기록 날짜
}
