package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.RecordRequestDto;
import com.example.thirdprojectback.dto.RecordResponseDto;
import com.example.thirdprojectback.security.CustomUserDetails;
import com.example.thirdprojectback.service.RecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    // 1. 기록 생성
    @PostMapping
    public RecordResponseDto create(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody RecordRequestDto dto) {
        Long userId = userDetails.getUserId();
        return recordService.createRecord(userId, dto);
    }

    // 2. 단일 기록 조회
    @GetMapping("/{id}")
    public RecordResponseDto get(@PathVariable Long id) {
        return recordService.getRecord(id);
    }

    // 3. 내 기록 전체 조회
    @GetMapping("/my")
    public List<RecordResponseDto> getMyRecords(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails.getUserId();
        return recordService.getRecordsByUser(userId);
    }

    // 4. 페이징 전체 조회 (관리자용 등)
    @GetMapping
    public Page<RecordResponseDto> getAll(Pageable pageable) {
        return recordService.getAll(pageable);
    }

    // 5. 기록 수정
    @PutMapping("/{id}")
    public RecordResponseDto update(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @RequestBody RecordRequestDto dto) {
        Long userId = userDetails.getUserId();
        return recordService.updateRecord(id, userId, dto);
    }

    // 6. 기록 삭제
    @DeleteMapping("/{id}")
    public void delete(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        Long userId = userDetails.getUserId();
        recordService.deleteRecord(id, userId);
    }


    // 7. 그래프 데이터 조회
    @GetMapping("/graph")
    public List<Double> getGraphData(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam String date,
            @RequestParam String item
    ) {
        Long userId = userDetails.getUserId();
        return recordService.getGraphData(userId, date, item);
    }

    // 8. 전체 사용자 분석
    @GetMapping("/analysis")
    public Map<String, Object> getTotalAnalysis() {
        return recordService.getTotalAnalysis();
    }
}
