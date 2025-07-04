package com.example.thirdprojectback.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long todoItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "todolist_id")
    private Todolist todolist;

    private String todoitem;

    private boolean complete;
}