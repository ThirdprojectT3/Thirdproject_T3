package com.example.thirdprojectback.repository;

import com.example.thirdprojectback.entity.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<Record, Long> {

    List<Record> findAllByUserId(Long userId);

    List<Record> findByUserIdAndDateBetween(Long userId, LocalDate start, LocalDate end);
    List<Record> findTop7ByUserIdOrderByDateDesc(Long userId); //최근 7일 기록 가져오기

    List<Record> findByUserIdIn(List<Long> userIds);

    Optional<Record> findTopByUserIdOrderByDateDesc(Long userId);
}
