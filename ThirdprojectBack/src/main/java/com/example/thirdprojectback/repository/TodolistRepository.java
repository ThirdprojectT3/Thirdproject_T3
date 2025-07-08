package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Todolist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TodolistRepository extends JpaRepository<Todolist, Long> {
    Optional<Todolist> findByUserIdAndDate(Long userId, LocalDate date);
    List<Todolist> findAllByUserId(Long userId);

    List<Todolist> findTop7ByUserIdOrderByDateDesc(Long userId);
}
