package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.*;
import com.example.thirdprojectback.entity.Diet;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.entity.Record;
import com.example.thirdprojectback.entity.Todo;
import com.example.thirdprojectback.entity.Todolist;
import com.example.thirdprojectback.repository.MemberRepository;
import com.example.thirdprojectback.repository.RecordRepository;
import com.example.thirdprojectback.repository.TodolistRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final RecordRepository recordRepository;
    private final TodolistRepository todolistRepository;
    private final MemberRepository memberRepository;

    private final AIService aiService;
    private final TodoService todoService;

    /* ---------- CREATE ---------- */
    public AIResponseDto createRecord(Long userId, RecordRequestDto dto) {
        // 1. 오늘 날짜로 기록 저장
        Record savedRecord = recordRepository.save(toEntity(dto, userId));
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        // 2. 최근 7일 기록 + todo 불러오기

        List<Map<String, Object>> records = fetchRecent7RecordsAsMap(userId);
        List<Map<String, Object>> todolists = fetchRecentTodosAsMap(userId);

        // 3. AI 요청 구성
        AIRequestDto request = AIRequestDto.builder()
                .input(AIRequestDto.AIRequestInput.builder()
                        .user_id(userId)
                        .goal(member.getGoal().getDescription())
                        .diseases(member.getDiseases())
                        .records(records)
                        .todolists(todolists)
                        .prompt(dto.getPrompt())
                        .place(dto.getPlace())
                        .build())
                .build();
        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(request);
            System.out.println("✅ AI 요청 JSON:\n" + json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // 4. AI 서버 호출
        AIResponseDto aiResponse = aiService.getRecommendation(request);
        System.out.println(aiResponse);
        // 5. AI가 응답한 todolists를 DB에 저장
        saveAiResponse(userId, aiResponse.getTodolists(), aiResponse.getDiet());

        // 6. 프론트로 응답 전달
        return aiResponse;
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

    public GraphResponseDto getGraphData(Long userId, String duration, String category) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = switch (duration.toLowerCase()) {
            case "1w" -> endDate.minusWeeks(1);
            case "1m" -> endDate.minusMonths(1);
            case "3m" -> endDate.minusMonths(3); // ✅ 3개월 추가
            default -> throw new IllegalArgumentException("지원하지 않는 기간 형식: " + duration);
        };

        String item = mapKoreanCategoryToItemKey(category);

        List<Record> records = recordRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        if (records == null || records.isEmpty()) {
            return new GraphResponseDto(List.of(), category);
        }

        records.sort(Comparator.comparing(Record::getDate));

        List<GraphResponseDto.DataPoint> points = records.stream()
                .map(record -> {
                    Double value = switch (item) {
                        case "weight" -> toDouble(record.getWeight());
                        case "bmi" -> record.getBmi();
                        case "fat" -> record.getFat();
                        case "muscle" -> record.getMuscle();
                        case "bmr" -> record.getBmr();
                        case "vai" -> record.getVai();
                        case "sleep" -> toDouble(record.getSleep());
                        default -> null;
                    };

                    if (value == null) return null;

                    return GraphResponseDto.DataPoint.builder()
                            .date(record.getDate().toString())
                            .value(value)
                            .build();
                })
                .filter(Objects::nonNull)
                .toList();

        return new GraphResponseDto(points, category);
    }


    private String mapKoreanCategoryToItemKey(String category) {
        category = category.trim();
        return switch (category) {
            case "체중" -> "weight";
            case "BMI" -> "bmi";
            case "체지방" -> "fat";
            case "골격근량" -> "muscle";
            case "기초대사량" -> "bmr";
            case "내장지방지수" -> "vai";
            case "수면시간" -> "sleep";
            default -> throw new IllegalArgumentException("지원하지 않는 항목: " + category);
        };
    }


    public Map<String, Object> getTotalAnalysis(Long userId) {

        Member member = memberRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자 없음"));;
        int age = member.getAge();
        int minAge = age - 3;
        int maxAge = age + 3;

        List<Long> userIds = memberRepository.findUserIdsByAgeRange(minAge, maxAge);

        // 2. 해당 사용자들의 기록만 조회
        List<Record> records = recordRepository.findByUserIdIn(userIds);

        // 3. 평균 계산
        double avgWeight = records.stream().filter(r -> r.getWeight() != null).mapToDouble(Record::getWeight).average().orElse(0.0);
        double avgFat = records.stream().filter(r -> r.getFat() != null).mapToDouble(Record::getFat).average().orElse(0.0);
        double avgMuscle = records.stream().filter(r -> r.getMuscle() != null).mapToDouble(Record::getMuscle).average().orElse(0.0);
        double avgBmr = records.stream().filter(r -> r.getBmr() != null).mapToDouble(Record::getBmr).average().orElse(0.0);
        double avgBmi = records.stream().filter(r -> r.getBmi() != null).mapToDouble(Record::getBmi).average().orElse(0.0);
        double avgVai = records.stream().filter(r -> r.getVai() != null).mapToDouble(Record::getVai).average().orElse(0.0);
        String avgDate = records.stream().map(Record::getDate).max(LocalDate::compareTo).map(LocalDate::toString).orElse(null);

        // 4. 내 최신 기록
        Record myRecord = recordRepository.findTopByUserIdOrderByDateDesc(userId).orElse(null);

        Map<String, Object> average = Map.of(
                "weight", avgWeight,
                "fat", avgFat,
                "muscle", avgMuscle,
                "bmr", avgBmr,
                "bmi", avgBmi,
                "vai", avgVai,
                "date", avgDate
        );

        Map<String, Object> myrecord = myRecord == null ? Map.of() : Map.of(
                "weight", myRecord.getWeight(),
                "fat", myRecord.getFat(),
                "muscle", myRecord.getMuscle(),
                "bmr", myRecord.getBmr(),
                "bmi", myRecord.getBmi(),
                "vai", myRecord.getVai(),
                "date", myRecord.getDate().toString()
        );

        return Map.of(
                "age", age,
                "average", average,
                "myrecord", myrecord
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

    //7일 데이터
    public List<Map<String, Object>> fetchRecent7RecordsAsMap(Long userId) {
        List<Record> records = recordRepository.findTop7ByUserIdOrderByDateDesc(userId);
        return records.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", record.getDate().toString());
            map.put("sleep", record.getSleep());
            map.put("weight", record.getWeight());
            map.put("fat", record.getFat());
            map.put("muscle", record.getMuscle());
            map.put("bmr", record.getBmr());
            map.put("bmi", record.getBmi());
            map.put("vai", record.getVai());
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> fetchRecentTodosAsMap(Long userId) {
        List<Todolist> todolists = todolistRepository.findTop7ByUserIdOrderByDateDesc(userId);

        return todolists.stream().map(todolist -> {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", todolist.getDate().toString());

            List<Map<String, Object>> items = todolist.getTodos().stream()
                    .map(todo -> {
                        Map<String, Object> todoMap = new HashMap<>();
                        todoMap.put("todo", todo.getTodoitem());     // ✅ 필드명: todoitem
                        todoMap.put("complete", todo.isComplete());
                        return todoMap;
                    })
                    .collect(Collectors.toList());

            dayMap.put("items", items);
            return dayMap;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void saveAiResponse(Long userId, List<AIResponseDto.TodoItem> todoItems, List<AIResponseDto.DietItem> dietItems) {
        Todolist todolist = Todolist.builder()
                .userId(userId)
                .date(LocalDate.now()) // 오늘 날짜
                .allclear(false)
                .build();

        List<Todo> todos = todoItems.stream()
                .map(item -> {
                    // 유튜브 API 호출해서 관련 영상 URL 가져오기
                    String keyword = item.getTodoItem();
                    Optional<YouTubeVideoDto> video = todoService.searchYoutube(keyword);

                    return Todo.builder()
                            .todolist(todolist)
                            .todoitem(keyword)
                            .tip(item.getTip())
                            .youtubeId(video.map(YouTubeVideoDto::getVideoId).orElse(null))
                            .youtubeTitle(video.map(YouTubeVideoDto::getTitle).orElse(null))
                            .complete(false) // 기본값: 미완료
                            .build();
                })
                .toList();

        Diet diet = null;
        if (dietItems != null && !dietItems.isEmpty()) { // dietItems (리스트) 확인
            String breakfast = null;
            String lunch = null;
            String dinner = null;

            for (AIResponseDto.DietItem dItem : dietItems) {
                if (dItem.getBreakfast() != null) {
                    breakfast = dItem.getBreakfast();
                }
                if (dItem.getLunch() != null) {
                    lunch = dItem.getLunch();
                }
                if (dItem.getDinner() != null) {
                    dinner = dItem.getDinner();
                }
            }
            diet = Diet.builder()
                    .todolist(todolist)
                    .breakfast(breakfast)
                    .lunch(lunch)
                    .dinner(dinner)
                    .build();
        } else {
            System.out.println("AI 응답에 식단 정보가 없습니다 (dietItems 리스트가 비어있음).");
        }

        todolist.setTodos(todos);
        todolist.setDiet(diet);
        todolistRepository.save(todolist);
    }
}