package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodolistRequestDto {
    private Long userId;
    private LocalDate date;
    private boolean allclear;
}
