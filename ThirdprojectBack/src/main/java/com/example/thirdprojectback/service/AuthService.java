package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.LoginRequest;
import com.example.thirdprojectback.dto.LoginResponse;
import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.SignupResponse;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
import com.example.thirdprojectback.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /* -------------------------------------------------
     * 회원가입
     * ------------------------------------------------- */
    public SignupResponse register(MemberRequestDto requestDto) {

        // 1) 이메일 중복 체크
        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 2) 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(requestDto.getPassword());

        // 3) Member 엔티티 생성 및 저장
        Member newMember = Member.builder()
                .email(requestDto.getEmail())
                .name(requestDto.getName())
                .password(encodedPw)
                .height(requestDto.getHeight())
                .age(requestDto.getAge())
                .gender(requestDto.getGender())
                .goal(requestDto.getGoal())
                .build();

        memberRepository.save(newMember);

        // 4) 토큰을 굳이 발급하지 않고 “회원가입 성공” 메시지만 전달
        return new SignupResponse("회원가입 성공");
    }

    /* -------------------------------------------------
     * 로그인
     * ------------------------------------------------- */
    public LoginResponse login(LoginRequest loginRequest) {

        try {
            // 1) Spring Security AuthenticationManager로 인증 시도
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // 2) 인증 통과 → JWT 발급
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            // 3) 토큰만 응답
            return new LoginResponse(token);

        } catch (AuthenticationException ex) {
            // 인증 실패
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }
}
