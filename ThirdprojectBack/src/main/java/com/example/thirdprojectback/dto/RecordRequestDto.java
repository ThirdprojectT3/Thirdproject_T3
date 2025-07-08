package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordRequestDto {
    private Float sleep;
    private Long weight;
    private Double fat;
    private Double muscle;
    private Double bmr;
    private Double bmi;
    private Double vai;
    private LocalDate date;
    private String prompt;
    private String place;
}
