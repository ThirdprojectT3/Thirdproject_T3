package com.example.thirdprojectback.dto;

import lombok.*;

import java.util.List;
import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class YouTubeResponseDto {
    private List<Item> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Item {
        private Id id;
        private Snippet snippet;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Id {
        private String videoId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @ToString
    public static class Snippet {
        private String title;
    }

    public Optional<YouTubeVideoDto> toYouTubeVideo() {
        if (items != null && !items.isEmpty()) {
            Item item = items.get(0);
            return Optional.of(YouTubeVideoDto.builder()
                    .videoId(item.getId().getVideoId())
                    .title(item.getSnippet().getTitle())
                    .build());
        }
        return Optional.empty();
    }
}
