package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "record")
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 식별자 필요

    private Long userId;

    private Long weight;

    private Double fat;       // 지방
    private Double muscle;    // 골격근량
    private Double bmr;       // 기초대사량
    private Double bmi;
    private Double vai;       // 내장지방지수

    private LocalDate date;
}
