package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
}
