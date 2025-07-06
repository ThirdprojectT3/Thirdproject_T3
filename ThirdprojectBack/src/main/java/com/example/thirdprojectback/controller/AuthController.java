package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.AuthResponse;
import com.example.thirdprojectback.dto.LoginRequest;
import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.service.AuthService;
import jakarta.validation.Valid; // @Valid 어노테이션 사용을 위해 임포트
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") // 인증 관련 API는 "/api/auth" 경로로 처리
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ✅ 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerMember(@Valid @RequestBody MemberRequestDto requestDto) {
        AuthResponse response = authService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ✅ 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginMember(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // TODO: 비밀번호 재설정, 이메일 인증 등 필요시 추가
}