package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoResponseDto {
    private Long todoItemId;
    private Long todolistId;
    private String todoitem;
    private boolean complete;
    private LocalDate date;   // Todolist에 연결된 날짜
}
