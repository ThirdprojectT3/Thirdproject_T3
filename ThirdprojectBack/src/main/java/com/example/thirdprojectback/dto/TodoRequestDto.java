package com.example.thirdprojectback.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoRequestDto {
    private Long todolistId;     // 연관된 Todolist ID
    private String todoitem;     // 할 일 내용
    private Boolean complete;    // 체크 여부 (null이면 기본값 false로 처리)
}
