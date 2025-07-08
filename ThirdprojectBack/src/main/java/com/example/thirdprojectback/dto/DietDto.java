package com.example.thirdprojectback.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietDto {
    private Long dietId;
    private Long todolistId;
    private String breakfast;
    private String lunch;
    private String dinner;
    private LocalDate date;
}
