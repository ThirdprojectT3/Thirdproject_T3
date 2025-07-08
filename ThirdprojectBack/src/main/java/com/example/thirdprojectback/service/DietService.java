package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.DietDto;
import com.example.thirdprojectback.entity.Diet;
import com.example.thirdprojectback.repository.DietRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DietService {
    private final DietRepository dietRepository;
    /* ---------- READ ---------- */
    public DietDto getDietById(Long dietId) {
        Diet diet = dietRepository.findById(dietId)
                .orElseThrow(() -> new IllegalArgumentException("Diet not found: " + dietId));
        return toDto(diet);
    }

    public DietDto getDietByTodolist(Long todolistId){
        return dietRepository.findByTodolist_TodolistId(todolistId)
                .map(this::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Diet not found: " + todolistId+"에 해당하는 Diet를 찾지 못했습니다."));
    }

    /* ---------- Mapping ---------- */
    private DietDto toDto(Diet diet) {
        return DietDto.builder()
                .dietId(diet.getDietId())
                .todolistId(diet.getTodolist().getTodolistId())
                .breakfast(diet.getBreakfast())
                .lunch(diet.getLunch())
                .dinner(diet.getDinner())
                .date(diet.getTodolist().getDate())
                .build();
    }
}
