package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.TodoRequestDto;
import com.example.thirdprojectback.dto.TodoResponseDto;
import com.example.thirdprojectback.dto.YouTubeResponseDto;
import com.example.thirdprojectback.dto.YouTubeVideoDto;
import com.example.thirdprojectback.entity.Todo;
import com.example.thirdprojectback.entity.Todolist;
import com.example.thirdprojectback.repository.TodoRepository;
import com.example.thirdprojectback.repository.TodolistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;
    private final TodolistRepository todolistRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${youtube.api.key}")
    private String apiKey;

    /* ---------- CREATE ---------- */
    public TodoResponseDto createTodo(TodoRequestDto dto, Long userId) {
        // 날짜가 누락되면 예외 발생
        if (dto.getDate() == null) {
            throw new IllegalArgumentException("날짜는 필수입니다.");
        }

        // userId + date 조합으로 Todolist 자동 생성 or 조회
        Todolist todolist = todolistRepository.findByUserIdAndDate(userId, dto.getDate())
                .orElseGet(() -> {
                    Todolist newList = Todolist.builder()
                            .userId(userId)
                            .date(dto.getDate())
                            .allclear(false)
                            .build();
                    return todolistRepository.save(newList);
                });

        // Todo 생성
        Todo todo = Todo.builder()
                .todolist(todolist)
                .todoitem(dto.getTodoitem())
                .complete(dto.getComplete() != null && dto.getComplete())
                .build();

        return toDto(todoRepository.save(todo));
    }


    /* ---------- READ ---------- */
    public TodoResponseDto getTodo(Long todoItemId) {
        Todo todo = todoRepository.findById(todoItemId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoItemId));
        return toDto(todo);
    }

    public List<TodoResponseDto> getTodosByTodolist(Long todolistId) {
        return todoRepository.findAllByTodolist_TodolistId(todolistId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TodoResponseDto> getTodosByUser(Long userId) {
        return todoRepository.findAllByTodolist_UserId(userId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /* ---------- UPDATE ---------- */
    public TodoResponseDto updateTodo(Long todoItemId, TodoRequestDto dto) {
        Todo todo = todoRepository.findById(todoItemId)
                .orElseThrow(() -> new IllegalArgumentException("Todo not found: " + todoItemId));

        if (dto.getTodoitem() != null)  todo.setTodoitem(dto.getTodoitem());
        if (dto.getComplete() != null)  todo.setComplete(dto.getComplete());

        return toDto(todoRepository.save(todo));
    }

    /* ---------- DELETE ---------- */
    public void deleteTodo(Long todoItemId) {
        if (!todoRepository.existsById(todoItemId)) {
            throw new IllegalArgumentException("Todo not found: " + todoItemId);
        }
        todoRepository.deleteById(todoItemId);
    }

    /* ---------- WEEK / MONTH ---------- */
    public List<TodoResponseDto> getWeeklyTodos(Long userId) {
        LocalDate end   = LocalDate.now();
        LocalDate start = end.minusDays(6); // 최근 7일
        return todoRepository
                .findAllByTodolist_UserIdAndTodolist_DateBetween(userId, start, end)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<TodoResponseDto> getMonthlyTodos(Long userId, YearMonth ym) {
        LocalDate start = ym.atDay(1);
        LocalDate end   = ym.atEndOfMonth();
        return todoRepository
                .findAllByTodolist_UserIdAndTodolist_DateBetween(userId, start, end)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /*Youtube API 호출*/
    public Optional<YouTubeVideoDto> searchYoutube(String keyword) {
        String url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                .queryParam("part", "snippet")
                .queryParam("q", keyword)
                .queryParam("type", "video")
                .queryParam("maxResults", 1)
                .queryParam("fields", "items(id/videoId,snippet/title)")
                .queryParam("key", apiKey)
                .build()
                .toUriString();

        try {
            ResponseEntity<YouTubeResponseDto> response = restTemplate.getForEntity(url, YouTubeResponseDto.class);
            System.out.println("Response 전체: " + response);
            System.out.println("Response Body: " + response.getBody());
            System.out.println("YouTubeVideoDto(Optional): " + response.getBody().toYouTubeVideo());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().toYouTubeVideo();
            }
        } catch (Exception e) {
            System.out.println("유튜브 API 호출 실패: " + e.getMessage());
        }

        return Optional.empty();
    }

    /* ---------- Mapping ---------- */
    private TodoResponseDto toDto(Todo todo) {
        return TodoResponseDto.builder()
                .todoItemId(todo.getTodoItemId())
                .todolistId(todo.getTodolist().getTodolistId())
                .todoitem(todo.getTodoitem())
                .tip(todo.getTip())
                .complete(todo.isComplete())
                .date(todo.getTodolist().getDate())
                .build();
    }

}
