package com.example.thirdprojectback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DietResponseDto {
    private LocalDate date;
    private String breakfast;
    private String lunch;
    private String dinner;
}
