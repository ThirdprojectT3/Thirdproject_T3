package com.example.thirdprojectback.dto;

import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.entity.Diet;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodolistResponseDto {
    private Long todolistId;
    private Long userId;
    private LocalDate date;
    private boolean allclear;
    private List<TodoResponseDto> todos;
    private DietDto diet;
}
