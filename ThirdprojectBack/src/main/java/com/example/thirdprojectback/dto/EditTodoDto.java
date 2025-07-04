package com.example.thirdprojectback.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditTodoDto {
    private Long todoItemId;
    private String todoitem;
    private Boolean complete;
}
