package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Diet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DietRepository extends JpaRepository<Diet, Long> {
    Optional<Diet> findByTodolist_TodolistId(Long todolistId);
}
