package com.example.thirdprojectback.runner;

import com.example.thirdprojectback.entity.*;
import com.example.thirdprojectback.entity.Record;
import com.example.thirdprojectback.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitRunner {
    private final PasswordEncoder passwordEncoder; // 비밀번호 인코딩

    private final MemberRepository memberRepository;
    private final RecordRepository recordRepository;
    private final TodolistRepository todolistRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // 1. 사용자 2명 생성
            Member user1 = memberRepository.save(Member.builder()
                    .email("a@a.com")
                    .name("홍길동")
                    .password(passwordEncoder.encode("123"))
                    .age(25)
                    .height(175)
                    .goal(Member.Goal.근력향상)
                    .gender(Member.Gender.MALE)
                    .diseases(List.of("고혈압"))
                    .build());

            Member user2 = memberRepository.save(Member.builder()
                    .email("b@b.com")
                    .name("김영희")
                    .password("123")
                    .age(30)
                    .height(160)
                    .goal(Member.Goal.체중감량)
                    .gender(Member.Gender.FEMALE)
                    .diseases(List.of("당뇨"))
                    .build());

            // 2. 사용자별로 7일치 기록 및 투두 생성
            for (Member user : List.of(user1, user2)) {
                for (int i = 0; i < 7; i++) {
                    LocalDate date = LocalDate.now().minusDays(i);

                    // 기록 생성
                    recordRepository.save(Record.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .weight(60L + i + (user.getUserId() * 5)) // 임의로 유저별로 다르게
                            .fat(15.0 + i)
                            .muscle(30.0 + i)
                            .bmr(1500.0 + i)
                            .bmi(22.0 + i)
                            .vai(1.0 + i)
                            .sleep(6.0f + i)
                            .build());

                    // Todolist + Todo 생성
                    Todolist todolist = Todolist.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .allclear(false)
                            .build();

                    List<Todo> todos = new ArrayList<>();

                    todos.add(Todo.builder()
                            .todolist(todolist)
                            .todoitem("스쿼트 " + (20 + i * 5) + "개")
                            .complete(i % 2 == 0) // 짝수날 완료
                            .build());

                    todos.add(Todo.builder()
                            .todolist(todolist)
                            .todoitem("스트레칭 10분")
                            .complete(i % 3 == 0) // 3일마다 완료
                            .build());

                    todolist.setTodos(todos);
                    todolistRepository.save(todolist);
                }
            }

            System.out.println("✅ 사용자 2명 + 7일치 기록 및 투두 데이터 삽입 완료!");
        };
    }
}
