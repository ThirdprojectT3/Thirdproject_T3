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
import java.util.Random;


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
            // ✅ 5명의 사용자 생성
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
                    .password(passwordEncoder.encode("123"))
                    .age(30)
                    .height(160)
                    .goal(Member.Goal.체중감량)
                    .gender(Member.Gender.FEMALE)
                    .diseases(List.of("당뇨"))
                    .build());

            Member user3 = memberRepository.save(Member.builder()
                    .email("c@c.com")
                    .name("이민호")
                    .password(passwordEncoder.encode("123"))
                    .age(28)
                    .height(178)
                    .goal(Member.Goal.근력향상)
                    .gender(Member.Gender.MALE)
                    .diseases(List.of())
                    .build());

            Member user4 = memberRepository.save(Member.builder()
                    .email("d@d.com")
                    .name("박지은")
                    .password(passwordEncoder.encode("123"))
                    .age(32)
                    .height(165)
                    .goal(Member.Goal.체중감량)
                    .gender(Member.Gender.FEMALE)
                    .diseases(List.of("빈혈"))
                    .build());

            Member user5 = memberRepository.save(Member.builder()
                    .email("e@e.com")
                    .name("장동건")
                    .password(passwordEncoder.encode("123"))
                    .age(40)
                    .height(182)
                    .goal(Member.Goal.체중감량)
                    .gender(Member.Gender.MALE)
                    .diseases(List.of("고지혈증"))
                    .build());

            Random random = new Random();
            List<Member> users = List.of(user1, user2, user3, user4, user5);
            String[] exerciseItems = {"스쿼트", "푸쉬업", "런지", "플랭크", "버피", "스트레칭"};

            // ✅ 각 사용자에 대해 30일치 기록 및 투두 생성
            for (Member user : users) {
                for (int i = 0; i < 30; i++) {
                    LocalDate date = LocalDate.now().minusDays(i);

                    // 기록 저장
                    recordRepository.save(Record.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .weight(50L + random.nextInt(30)) // 50~80kg
                            .fat(10.0 + random.nextDouble() * 15) // 10~25%
                            .muscle(25.0 + random.nextDouble() * 10)
                            .bmr(1400.0 + random.nextDouble() * 400)
                            .bmi(18.0 + random.nextDouble() * 10)
                            .vai(0.5 + random.nextDouble() * 2.0)
                            .sleep(5.0f + random.nextFloat() * 3.0f)
                            .build());

                    // Todolist 및 Todo 생성
                    Todolist todolist = Todolist.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .allclear(false)
                            .build();

                    List<Todo> todos = new ArrayList<>();
                    int todoCount = 1 + random.nextInt(3); // 1~3개

                    for (int t = 0; t < todoCount; t++) {
                        String todoText = exerciseItems[random.nextInt(exerciseItems.length)] + " " + (10 + random.nextInt(30)) + "회";

                        todos.add(Todo.builder()
                                .todolist(todolist)
                                .todoitem(todoText)
                                .complete(random.nextBoolean())
                                .build());
                    }

                    todolist.setTodos(todos);
                    todolistRepository.save(todolist);
                }
            }

            System.out.println("사용자 5명 + 30일치 기록(record) 및 투두 데이터 삽입 완료!"+"테스트!");
        };
    }
}
