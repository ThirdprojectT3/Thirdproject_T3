package com.example.thirdprojectback.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class AIResponseDto {
    private List<TodoItem> todolists;
    private List<DietItem> diet;
    private String cheering;

    @Data
    public static class TodoItem {
        private String todoItem;
        private String tip;
    }

    @Data
    public static class DietItem {
        private String breakfast;
        private String lunch;
        private String dinner;
    }
}
