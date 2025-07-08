package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.DietDto;
import com.example.thirdprojectback.service.DietService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {
    private final DietService dietService;

    @GetMapping("/{dietId}")
    public ResponseEntity<DietDto> getDietByDietId(@PathVariable Long dietId) {
        return ResponseEntity.ok(dietService.getDietById(dietId));
    }

    @GetMapping("/{todolistId}")
    public ResponseEntity<DietDto> getDietByTodolistId(@PathVariable Long todolistId) {
        return ResponseEntity.ok(dietService.getDietByTodolist(todolistId));
    }
}
