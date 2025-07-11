package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordResponseDto {
    private Long id;
    private Long userId;
    private Float sleep;
    private Long weight;
    private Double fat;
    private Double muscle;
    private Double bmr;
    private Double bmi;
    private Double vai;
    private LocalDate date;

    public static RecordResponseDto from(com.example.thirdprojectback.entity.Record record) {
        return RecordResponseDto.builder()
                .id(record.getId())
                .userId(record.getUserId())
                .sleep(record.getSleep())
                .weight(record.getWeight())
                .fat(record.getFat())
                .muscle(record.getMuscle())
                .bmr(record.getBmr())
                .bmi(record.getBmi())
                .vai(record.getVai())
                .date(record.getDate())
                .build();
    }
}
