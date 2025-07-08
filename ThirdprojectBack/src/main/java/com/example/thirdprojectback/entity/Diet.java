package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "diet")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Diet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "diet_id", nullable = false)
    private Long dietId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "todolist_id", unique = true, nullable = false)
    private Todolist todolist;

    @Column(nullable = false)
    private String breakfast;

    @Column(nullable = false)
    private String lunch;

    @Column(nullable = false)
    private String dinner;
}
