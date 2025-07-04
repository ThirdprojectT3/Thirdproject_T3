package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.TodoRequestDto;
import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.entity.Todo;
import com.example.thirdprojectback.entity.Todolist;
import com.example.thirdprojectback.repository.TodoRepository;
import com.example.thirdprojectback.repository.TodolistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final TodolistRepository todolistRepository;

    /* ---------- CREATE ---------- */
    public TodoResponseDto createTodo(TodoRequestDto dto) {
        Todolist todolist = todolistRepository.findById(dto.getTodolistId())
                .orElseThrow(() -> new IllegalArgumentException("Todolist not found: " + dto.getTodolistId()));

        Todo todo = Todo.builder()
                .todolist(todolist)
                .todoitem(dto.getTodoitem())
                .complete(dto.getComplete() != null && dto.getComplete())  // null-safe 처리
                .build();

        return toDto(todoRepository.save(todo));
    }

    /* ---------- READ ---------- */
    public TodoResponseDto getTodo(Long todoItemId) {
        Todo todo = todoRepository.findById(todoItemId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoItemId));
        return toDto(todo);
    }

    public List<TodoResponseDto> getTodosByTodolist(Long todolistId) {
        return todoRepository.findAllByTodolist_TodolistId(todolistId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TodoResponseDto> getTodosByUser(Long userId) {
        List<Todo> todos = todoRepository.findAllByTodolist_UserId(userId);
        return todos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /* ---------- UPDATE ---------- */
    public TodoResponseDto updateTodo(Long todoItemId, TodoRequestDto dto) {
        Todo todo = todoRepository.findById(todoItemId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoItemId));

        if (dto.getTodoitem() != null)
            todo.setTodoitem(dto.getTodoitem());
        if (dto.getComplete() != null)
            todo.setComplete(dto.getComplete());

        return toDto(todoRepository.save(todo));
    }

    /* ---------- DELETE ---------- */
    public void deleteTodo(Long todoItemId) {
        if (!todoRepository.existsById(todoItemId)) {
            throw new IllegalArgumentException("Todo not found: " + todoItemId);
        }
        todoRepository.deleteById(todoItemId);
    }

    /* ---------- Mapping ---------- */
    private TodoResponseDto toDto(Todo todo) {
        return TodoResponseDto.builder()
                .todoItemId(todo.getTodoItemId())
                .todolistId(todo.getTodolist().getTodolistId())
                .todoitem(todo.getTodoitem())
                .complete(todo.isComplete())
                .date(todo.getTodolist().getDate())
                .build();
    }
    public List<TodoResponseDto> getWeeklyTodos(Long userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6); // 오늘 포함 7일치
        List<Todo> todos = todoRepository
                .findAllByTodolist_UserIdAndTodolist_DateBetween(userId, start, end);

        return todos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<TodoResponseDto> getMonthlyTodos(Long userId, YearMonth yearMonth) {
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();
        List<Todo> todos = todoRepository
                .findAllByTodolist_UserIdAndTodolist_DateBetween(userId, start, end);

        return todos.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
