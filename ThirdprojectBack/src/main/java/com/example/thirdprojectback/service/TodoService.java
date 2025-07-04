package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.AddTodoDto;
import com.example.thirdprojectback.dto.EditTodoDto;
import com.example.thirdprojectback.entity.Todo;
import com.example.thirdprojectback.entity.Todolist;
import com.example.thirdprojectback.repository.TodoRepository;
import com.example.thirdprojectback.repository.TodolistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final TodolistRepository todolistRepository;

    public Object getMyTodo() {
        // TODO: 실제 로직 구현
        return "오늘 포함 일주일치 투두 리턴";
    }

    public Object getMonthTodo(String month) {
        // TODO: 실제 로직 구현
        return "월별 투두 리턴: " + month;
    }

    public Object addTodo(AddTodoDto dto) {
        Optional<Todolist> todolistOpt = todolistRepository.findById(dto.getTodoId());
        if (todolistOpt.isEmpty()) return "Todolist not found";

        Todo todo = new Todo();
        todo.setTodolist(todolistOpt.get());
        todo.setTodoitem(dto.getTodoitem());
        todo.setComplete(false);
        todoRepository.save(todo);

        return "투두가 추가되었습니다.";
    }

    public Object editTodo(EditTodoDto dto) {
        Optional<Todo> todoOpt = todoRepository.findById(dto.getTodoItemId());
        if (todoOpt.isEmpty()) return "Todo not found";

        Todo todo = todoOpt.get();
        todo.setTodoitem(dto.getTodoitem());
        todo.setComplete(dto.getComplete());
        todoRepository.save(todo);

        return "투두가 수정되었습니다.";
    }
}
