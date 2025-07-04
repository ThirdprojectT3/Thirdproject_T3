package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Todolist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodolistRepository extends JpaRepository<Todolist, Long> {
}
