package com.example.thirdprojectback.dto;

import com.example.thirdprojectback.entity.Member.Gender;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponseDto {
    private Long userId;
    private String email;
    private String name;
    private int height;
    private int age;
    private Gender gender;
    private String goal;
}
