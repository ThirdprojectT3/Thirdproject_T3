package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoRequestDto {
    private String todoitem;
    private Boolean complete;
    private LocalDate date; // 날짜 필수
}
