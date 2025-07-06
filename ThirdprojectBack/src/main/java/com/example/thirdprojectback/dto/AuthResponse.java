package com.example.thirdprojectback.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String jwtToken;
    private String message; // 성공/실패 메시지
    private Long userId; // 로그인 성공 시 사용자 ID
    private String email; // 로그인 성공 시 사용자 이메일
    private String name; // 로그인 성공 시 사용자 이름
}