package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "todolists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todolist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long todolistId;

    // 👇 userId를 단순 Long이 아닌 연관관계로 맵핑하는 것을 권장 (선택 사항)
    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    private boolean allclear;

    @OneToMany(mappedBy = "todolist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> todos = new ArrayList<>();

    @OneToOne(mappedBy = "todolist", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Diet diet;
}
