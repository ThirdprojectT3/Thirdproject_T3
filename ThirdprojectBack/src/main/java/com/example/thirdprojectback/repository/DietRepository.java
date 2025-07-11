package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Diet;
import com.example.thirdprojectback.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DietRepository extends JpaRepository<Diet, Long> {
    Optional<Diet> findByTodolist_TodolistId(Long todolistId);

    List<Diet> findAllByTodolist_UserIdAndTodolist_DateBetween(
            Long userId, LocalDate startDate, LocalDate endDate
    );

}
