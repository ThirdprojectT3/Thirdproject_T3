package com.example.thirdprojectback.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class YouTubeVideoDto {
    private String videoId;
    private String title;
}

