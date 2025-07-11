package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.AIRequestDto;
import com.example.thirdprojectback.dto.AIResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class AIService {

    @Value("${ai.server.url}")
    private String aiServerUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIResponseDto getRecommendation(AIRequestDto requestDto) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AIRequestDto> entity = new HttpEntity<>(requestDto, headers);

        ResponseEntity<AIResponseDto> response = restTemplate.exchange(
                aiServerUrl,
                HttpMethod.POST,
                entity,
                AIResponseDto.class
        );

        return response.getBody();
    }
}
