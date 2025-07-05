package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.TodoRequestDto;
import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    // ✅ 투두 추가
    @PostMapping
    public ResponseEntity<TodoResponseDto> add(@RequestBody TodoRequestDto dto) {
        return ResponseEntity.ok(todoService.createTodo(dto));
    }

    // ✅ 이번주 포함 최근 7일치 투두 조회
    @GetMapping("/week/{userId}")
    public ResponseEntity<List<TodoResponseDto>> week(@PathVariable Long userId) {
        return ResponseEntity.ok(todoService.getWeeklyTodos(userId));
    }

    // ✅ 월별 투두 조회 (예: 2025-07)
    @GetMapping("/month/{userId}")
    public ResponseEntity<List<TodoResponseDto>> month(
            @PathVariable Long userId,
            @RequestParam String ym // yyyy-MM
    ) {
        YearMonth yearMonth = YearMonth.parse(ym);
        return ResponseEntity.ok(todoService.getMonthlyTodos(userId, yearMonth));
    }

    // ✅ 투두 수정
    @PatchMapping("/{id}")
    public ResponseEntity<TodoResponseDto> edit(
            @PathVariable Long id,
            @RequestBody TodoRequestDto dto
    ) {
        return ResponseEntity.ok(todoService.updateTodo(id, dto));
    }

    // ✅ 투두 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remove(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }
}
