package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "todo_items")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long todoItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "todolist_id", nullable = false)
    private Todolist todolist;

    @Column(nullable = false)
    private String todoitem;

    @Column(nullable = false)
    private String tip;

    private boolean complete;
}