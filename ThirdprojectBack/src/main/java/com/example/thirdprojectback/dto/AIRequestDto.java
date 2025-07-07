package com.example.thirdprojectback.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIRequestDto {
    private AIRequestInput input;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AIRequestInput {
        private Long user_id;
        private String goal;
        private List<String> diseases;
        private List<Map<String, Object>> records;
        private List<Map<String, Object>> todolists;
        private String prompt;
        private String place;
    }
}
