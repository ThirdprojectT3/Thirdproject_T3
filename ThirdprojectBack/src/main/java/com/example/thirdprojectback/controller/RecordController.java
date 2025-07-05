package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.RecordRequestDto;
import com.example.thirdprojectback.dto.RecordResponseDto;
import com.example.thirdprojectback.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    // ✅ [1] 기본 CRUD

    // CREATE - 기록 생성
    @PostMapping
    public ResponseEntity<RecordResponseDto> create(@RequestBody RecordRequestDto dto) {
        return ResponseEntity.ok(recordService.createRecord(dto));
    }

    // READ - 단일 기록 조회
    @GetMapping("/{id}")
    public ResponseEntity<RecordResponseDto> read(@PathVariable Long id) {
        return ResponseEntity.ok(recordService.getRecord(id));
    }

    // READ - 사용자별 전체 기록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecordResponseDto>> readAllByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(recordService.getRecordsByUser(userId));
    }

    // UPDATE - 기록 수정
    @PutMapping("/{id}")
    public ResponseEntity<RecordResponseDto> update(@PathVariable Long id, @RequestBody RecordRequestDto dto) {
        return ResponseEntity.ok(recordService.updateRecord(id, dto));
    }

    // DELETE - 기록 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ [2] 분석 및 시각화 기능

    // 일일 기록 저장 (프론트 전용 응답 포맷)
    @PostMapping("/daily")
    public ResponseEntity<Map<String, Object>> saveDaily(@RequestBody RecordRequestDto dto) {
        recordService.createRecord(dto);
        return ResponseEntity.ok(Map.of(
                "status", 200,
                "code", null,
                "message", "success",
                "data", "ok"
        ));
    }

    // 그래프 데이터 조회 (월별 item별)
    @GetMapping("/graph")
    public ResponseEntity<List<Double>> getGraph(
            @RequestParam String date,      // 예: 2025-07
            @RequestParam String item,
            @RequestParam Long userId
    ) {
        return ResponseEntity.ok(recordService.getGraphData(userId, date, item));
    }

    // 전체 사용자 통계 분석
    @GetMapping("/analysis")
    public ResponseEntity<Map<String, Object>> analyzeAll() {
        return ResponseEntity.ok(recordService.getTotalAnalysis());
    }
}
