package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.DietDto;
import com.example.thirdprojectback.dto.DietResponseDto;
import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.security.CustomUserDetails;
import com.example.thirdprojectback.service.DietService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;

    // ✅ 1. 식단 ID로 조회
    @GetMapping("/dietid/{dietId}")
    public ResponseEntity<DietDto> getDietByDietId(@PathVariable Long dietId) {
        return ResponseEntity.ok(dietService.getDietById(dietId));
    }

    // ✅ 2. Todolist ID로 식단 조회
    @GetMapping("/todolistid/{todolistId}")
    public ResponseEntity<DietDto> getDietByTodolistId(@PathVariable Long todolistId) {
        return ResponseEntity.ok(dietService.getDietByTodolist(todolistId));
    }


    @GetMapping("/month")
    public ResponseEntity<List<DietResponseDto>> month(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String ym // yyyy-MM
    ) {
        YearMonth yearMonth = YearMonth.parse(ym);
        Long userId = userDetails.getUserId();
        return ResponseEntity.ok(dietService.getMonthlyDiets(userId, yearMonth));
    }
}
