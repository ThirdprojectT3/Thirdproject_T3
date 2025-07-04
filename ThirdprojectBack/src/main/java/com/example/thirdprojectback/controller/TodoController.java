package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.AddTodoDto;
import com.example.thirdprojectback.dto.EditTodoDto;
import com.example.thirdprojectback.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/todo")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping("/getmytodo")
    public ResponseEntity<?> getMyTodo() {
        return ResponseEntity.ok(todoService.getMyTodo());
    }

    @GetMapping("/monthtodo")
    public ResponseEntity<?> getMonthTodo(@RequestParam String month) {
        return ResponseEntity.ok(todoService.getMonthTodo(month));
    }

    @PostMapping("/addtodo")
    public ResponseEntity<?> addTodo(@RequestBody AddTodoDto dto) {
        return ResponseEntity.ok(todoService.addTodo(dto));
    }

    @PostMapping("/edittodo")
    public ResponseEntity<?> editTodo(@RequestBody EditTodoDto dto) {
        return ResponseEntity.ok(todoService.editTodo(dto));
    }
}
