package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findAllByUserId(Long userId);

    List<Record> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
}
