package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.*;
import com.example.thirdprojectback.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ✅ 회원가입 엔드포인트
    @PostMapping("/register")
    public ResponseEntity<SignupResponse> registerMember(@Valid @RequestBody MemberRequestDto requestDto) {
        SignupResponse response = authService.register(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ✅ 로그인 엔드포인트
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginMember(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    // TODO: 비밀번호 재설정, 이메일 인증 등 필요 시 추가
}
