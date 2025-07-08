package com.example.thirdprojectback.dto;

import com.example.thirdprojectback.entity.Member.Gender;
import com.example.thirdprojectback.entity.Member.Goal;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberUpdateDto {

    private String email;

    private String name;

    // 비밀번호는 필수 아님 (입력되었을 때만 변경)
    private String password;

    private Integer height;

    private Integer age;

    private Gender gender;

    private Goal goal;

    private List<String> diseases;
}
