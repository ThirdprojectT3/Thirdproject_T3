package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.RecordRequestDto;
import com.example.thirdprojectback.dto.RecordResponseDto;
import com.example.thirdprojectback.entity.Record;
import com.example.thirdprojectback.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;

    /* ---------- CREATE ---------- */
    public RecordResponseDto createRecord(RecordRequestDto dto) {
        Record saved = recordRepository.save(toEntity(dto));
        return toDto(saved);
    }

    /* ---------- READ ---------- */
    public RecordResponseDto getRecord(Long id) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found: " + id));
        return toDto(record);
    }

    public List<RecordResponseDto> getRecordsByUser(Long userId) {
        return recordRepository.findAllByUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<RecordResponseDto> getAll(Pageable pageable) {
        return recordRepository.findAll(pageable).map(this::toDto);
    }

    /* ---------- UPDATE ---------- */
    public RecordResponseDto updateRecord(Long id, RecordRequestDto dto) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found: " + id));

        record.setSleep(dto.getSleep());
        record.setWeight(dto.getWeight());
        record.setFat(dto.getFat());
        record.setMuscle(dto.getMuscle());
        record.setBmr(dto.getBmr());
        record.setBmi(dto.getBmi());
        record.setVai(dto.getVai());
        record.setDate(dto.getDate());

        return toDto(recordRepository.save(record));
    }

    /* ---------- DELETE ---------- */
    public void deleteRecord(Long id) {
        if (!recordRepository.existsById(id)) {
            throw new IllegalArgumentException("Record not found: " + id);
        }
        recordRepository.deleteById(id);
    }

    /* ---------- 분석 기능 ---------- */

    // 그래프 데이터 (월별 항목 조회)
    public List<Double> getGraphData(Long userId, String date, String item) {
        LocalDate start = LocalDate.parse(date + "-01"); // ex: 2025-07 → 2025-07-01
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<Record> records = recordRepository.findByUserIdAndDateBetween(userId, start, end);

        return records.stream()
                .map(r -> switch (item.toLowerCase()) {
                    case "weight" -> toDouble(r.getWeight());
                    case "bmi" -> r.getBmi();
                    case "fat" -> r.getFat();
                    case "muscle" -> r.getMuscle();
                    case "bmr" -> r.getBmr();
                    case "vai" -> r.getVai();
                    case "sleep" -> toDouble(r.getSleep());
                    default -> throw new IllegalArgumentException("지원하지 않는 항목: " + item);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // 전체 사용자 통계 분석
    public Map<String, Object> getTotalAnalysis() {
        List<Record> records = recordRepository.findAll();

        double avgBmi = records.stream()
                .filter(r -> r.getBmi() != null)
                .mapToDouble(Record::getBmi)
                .average()
                .orElse(0.0);

        double avgMuscle = records.stream()
                .filter(r -> r.getMuscle() != null)
                .mapToDouble(Record::getMuscle)
                .average()
                .orElse(0.0);

        double avgFat = records.stream()
                .filter(r -> r.getFat() != null)
                .mapToDouble(Record::getFat)
                .average()
                .orElse(0.0);

        return Map.of(
                "average_bmi", avgBmi,
                "average_muscle", avgMuscle,
                "average_fat", avgFat
        );
    }

    /* ---------- 변환 메서드 ---------- */

    private Record toEntity(RecordRequestDto dto) {
        return Record.builder()
                .userId(dto.getUserId())
                .sleep(dto.getSleep())
                .weight(dto.getWeight())
                .fat(dto.getFat())
                .muscle(dto.getMuscle())
                .bmr(dto.getBmr())
                .bmi(dto.getBmi())
                .vai(dto.getVai())
                .date(dto.getDate())
                .build();
    }

    private RecordResponseDto toDto(Record entity) {
        return RecordResponseDto.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .sleep(entity.getSleep())
                .weight(entity.getWeight())
                .fat(entity.getFat())
                .muscle(entity.getMuscle())
                .bmr(entity.getBmr())
                .bmi(entity.getBmi())
                .vai(entity.getVai())
                .date(entity.getDate())
                .build();
    }

    private Double toDouble(Number number) {
        return number == null ? null : number.doubleValue();
    }
}
