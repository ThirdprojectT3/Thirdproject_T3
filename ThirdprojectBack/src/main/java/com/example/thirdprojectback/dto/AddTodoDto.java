package com.example.thirdprojectback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddTodoDto {
    private Long todoId;         // todolist_id
    private String todoitem;
}
