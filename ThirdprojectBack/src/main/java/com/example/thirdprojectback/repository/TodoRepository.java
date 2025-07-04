package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findAllByTodolist_TodolistId(Long todolistId);

    List<Todo> findAllByTodolist_UserId(Long userId);  // 이거 꼭 정의돼야 동작함

    List<Todo> findAllByTodolist_UserIdAndTodolist_DateBetween(
            Long userId, LocalDate startDate, LocalDate endDate
    );
}
