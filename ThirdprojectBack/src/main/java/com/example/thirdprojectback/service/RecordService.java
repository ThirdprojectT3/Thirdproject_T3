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
    public RecordResponseDto createRecord(Long userId, RecordRequestDto dto) {
        Record saved = recordRepository.save(toEntity(dto, userId));
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
    public RecordResponseDto updateRecord(Long id, Long userId, RecordRequestDto dto) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found: " + id));

        if (!record.getUserId().equals(userId)) {
            throw new SecurityException("다른 사용자의 기록은 수정할 수 없습니다.");
        }

        Optional.ofNullable(dto.getSleep()).ifPresent(record::setSleep);
        Optional.ofNullable(dto.getWeight()).ifPresent(record::setWeight);
        Optional.ofNullable(dto.getFat()).ifPresent(record::setFat);
        Optional.ofNullable(dto.getMuscle()).ifPresent(record::setMuscle);
        Optional.ofNullable(dto.getBmr()).ifPresent(record::setBmr);
        Optional.ofNullable(dto.getBmi()).ifPresent(record::setBmi);
        Optional.ofNullable(dto.getVai()).ifPresent(record::setVai);
        Optional.ofNullable(dto.getDate()).ifPresent(record::setDate);

        return toDto(recordRepository.save(record));
    }

    /* ---------- DELETE ---------- */
    public void deleteRecord(Long id, Long userId) {
        Record record = recordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Record not found: " + id));

        if (!record.getUserId().equals(userId)) {
            throw new SecurityException("다른 사용자의 기록은 삭제할 수 없습니다.");
        }

        recordRepository.deleteById(id);
    }

    /* ---------- 분석 기능 ---------- */

    public List<Double> getGraphData(Long userId, String date, String item) {
        LocalDate start = LocalDate.parse(date + "-01");
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

    private Record toEntity(RecordRequestDto dto, Long userId) {
        return Record.builder()
                .userId(userId)
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
