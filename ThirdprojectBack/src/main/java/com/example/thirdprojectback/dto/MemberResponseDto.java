package com.example.thirdprojectback.dto;

import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.entity.Member.Gender;
import com.example.thirdprojectback.entity.Member.Goal;
import lombok.*;

import java.util.List;

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
    private Goal goal;
    private List<String> diseases;
}