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
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final RecordRepository recordRepository;
    private final TodolistRepository todolistRepository;
    private final DietRepository dietRepository;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // ✅ 회원 5명 생성
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

            List<Member> users = List.of(user1, user2, user3, user4, user5);
            Random random = new Random();

            String[] exerciseItems = {"스쿼트", "푸쉬업", "런지", "플랭크", "버피", "스트레칭"};
            String[][] youtubeData = {
                    {"dQw4w9WgXcQ", "Rick Astley - Never Gonna Give You Up"},
                    {"9bZkp7q19f0", "PSY - GANGNAM STYLE"},
                    {"e-ORhEE9VVg", "Taylor Swift - Blank Space"},
                    {"fRh_vgS2dFE", "Justin Bieber - Sorry"},
                    {"3JZ_D3ELwOQ", "Ed Sheeran - Shape of You"}
            };
            String[] tips = {
                    "동작을 천천히 하며 근육을 느껴보세요.",
                    "호흡을 일정하게 유지하며 반복하세요.",
                    "자세를 무너뜨리지 않는 게 중요해요.",
                    "운동 전 스트레칭은 필수예요!",
                    "15회씩 나누어 여러 세트로 해보세요.",
                    "중간에 물 한잔 마셔주세요."
            };

            for (Member user : users) {
                for (int i = 0; i < 30; i++) {
                    LocalDate date = LocalDate.now().minusDays(i+1);

                    // ✅ Record 생성
                    recordRepository.save(Record.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .weight(50L + random.nextInt(30))
                            .fat(10.0 + random.nextDouble() * 15)
                            .muscle(25.0 + random.nextDouble() * 10)
                            .bmr(1400.0 + random.nextDouble() * 400)
                            .bmi(18.0 + random.nextDouble() * 10)
                            .vai(0.5 + random.nextDouble() * 2.0)
                            .sleep(5.0f + random.nextFloat() * 3.0f)
                            .build());


                    Todolist todolist = Todolist.builder()
                            .userId(user.getUserId())
                            .date(date)
                            .allclear(false)
                            .build();

                    List<Todo> todos = new ArrayList<>();
                    int todoCount = 1 + random.nextInt(3);

                    for (int t = 0; t < todoCount; t++) {
                        String todoText = exerciseItems[random.nextInt(exerciseItems.length)] + " " + (10 + random.nextInt(30)) + "회";
                        String[] yt = youtubeData[random.nextInt(youtubeData.length)];
                        String tip = tips[random.nextInt(tips.length)];

                        todos.add(Todo.builder()
                                .todolist(todolist)
                                .todoitem(todoText)
                                .complete(random.nextBoolean())
                                .youtubeId(yt[0])
                                .youtubeTitle(yt[1])
                                .tip(tip) // ✅ tip 정보 추가
                                .build());
                    }

                    todolist.setTodos(todos);
                    todolistRepository.save(todolist);

                    // ✅ Diet 생성
                    dietRepository.save(Diet.builder()
                            .todolist(todolist)
                            .breakfast("오트밀 + 바나나 + 달걀")
                            .lunch("닭가슴살 샐러드 + 고구마")
                            .dinner("연어 스테이크 + 샐러드")
                            .build());
                }
            }

            System.out.println("✅ 5명 사용자 + 30일치 기록 + 투두 + 식단 + 유튜브 + 팁 초기화 완료");
        };
    }
}
