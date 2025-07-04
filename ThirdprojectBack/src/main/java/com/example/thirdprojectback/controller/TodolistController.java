package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.TodolistRequestDto;
import com.example.thirdprojectback.dto.TodolistResponseDto;
import com.example.thirdprojectback.service.TodolistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todolists")
@RequiredArgsConstructor
public class TodolistController {

    private final TodolistService todolistService;

    // ✅ 특정 날짜의 Todolist가 없으면 생성, 있으면 조회
    @PostMapping("/daily")
    public ResponseEntity<TodolistResponseDto> getOrCreateToday(@RequestBody TodolistRequestDto dto) {
        return ResponseEntity.ok(todolistService.getOrCreateTodolist(dto.getUserId(), dto.getDate()));
    }

    // ✅ 특정 사용자 전체 Todolist 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TodolistResponseDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(todolistService.getTodolistsByUser(userId));
    }

    // ✅ 특정 날짜의 Todolist 조회
    @GetMapping("/{userId}/date/{date}")
    public ResponseEntity<TodolistResponseDto> getByDate(
            @PathVariable Long userId,
            @PathVariable LocalDate date
    ) {
        return ResponseEntity.ok(todolistService.getTodolistByUserAndDate(userId, date));
    }
}
