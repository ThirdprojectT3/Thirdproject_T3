package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.entity.Todo;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {
    public TodoResponseDto toDto(Todo todo) {
        return TodoResponseDto.builder()
                .todoItemId(todo.getTodoItemId())
                .todolistId(todo.getTodolist().getTodolistId())
                .todoitem(todo.getTodoitem())
                .complete(todo.isComplete())
                .date(todo.getTodolist().getDate())
                .build();
    }
}
