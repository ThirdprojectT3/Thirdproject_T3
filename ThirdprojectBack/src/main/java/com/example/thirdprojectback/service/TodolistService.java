package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.TodolistResponseDto;
import com.example.thirdprojectback.entity.Todolist;
import com.example.thirdprojectback.repository.TodolistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodolistService {

    private final TodolistRepository todolistRepository;

    /**
     * ✅ [1] 특정 날짜의 Todolist가 없으면 생성 후 반환
     */
    public TodolistResponseDto getOrCreateTodolist(Long userId, LocalDate date) {
        Todolist todolist = todolistRepository.findByUserIdAndDate(userId, date)
                .orElseGet(() -> {
                    Todolist newList = Todolist.builder()
                            .userId(userId)
                            .date(date)
                            .allclear(false)
                            .build();
                    return todolistRepository.save(newList);
                });

        return toDto(todolist);
    }

    /**
     * ✅ [2] 특정 사용자 ID로 모든 Todolist 반환
     */
    public List<TodolistResponseDto> getTodolistsByUser(Long userId) {
        return todolistRepository.findAllByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /**
     * ✅ [3] 특정 날짜의 Todolist 단건 조회
     */
    public TodolistResponseDto getTodolistByUserAndDate(Long userId, LocalDate date) {
        Todolist todolist = todolistRepository.findByUserIdAndDate(userId, date)
                .orElseThrow(() -> new IllegalArgumentException("Todolist not found for user " + userId + " at " + date));
        return toDto(todolist);
    }

    /* ✅ Entity → DTO 변환 */
    private TodolistResponseDto toDto(Todolist entity) {
        return TodolistResponseDto.builder()
                .todolistId(entity.getTodolistId())
                .userId(entity.getUserId())
                .date(entity.getDate())
                .allclear(entity.isAllclear())
                .build();
    }
}
