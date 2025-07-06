package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.AuthResponse;
import com.example.thirdprojectback.dto.LoginRequest;
import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
import com.example.thirdprojectback.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional // 인증 및 회원가입은 쓰기 작업이므로 트랜잭션 필요
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager; // AuthenticationManager 주입

    // 회원가입 메서드
    public AuthResponse register(MemberRequestDto requestDto) {
        // 이메일 중복 검사
        if (memberRepository.existsByEmail(requestDto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // Member 엔티티 생성
        Member newMember = Member.builder()
                .email(requestDto.getEmail())
                .name(requestDto.getName())
                .password(encodedPassword)
                .height(requestDto.getHeight())
                .age(requestDto.getAge())
                .gender(requestDto.getGender())
                .goal(requestDto.getGoal())
                .build();

        memberRepository.save(newMember);

        // 회원가입 성공 후 바로 로그인 처리 (선택 사항)
        String token = jwtUtil.generateToken(newMember.getEmail());

        return new AuthResponse(
                token,
                "회원가입 및 로그인 성공",
                newMember.getUserId(),
                newMember.getEmail(),
                newMember.getName()
        );
    }

    // 로그인 메서드
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            // AuthenticationManager를 사용하여 사용자 인증 시도
            // CustomUserDetailsService의 loadUserByUsername과 PasswordEncoder가 여기서 작동합니다.
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // 인증 성공 시, JWT 토큰 생성
            String token = jwtUtil.generateToken(loginRequest.getEmail());

            // 사용자 정보 조회 (응답 DTO에 포함하기 위해)
            Member member = memberRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

            return new AuthResponse(
                    token,
                    "로그인 성공",
                    member.getUserId(),
                    member.getEmail(),
                    member.getName()
            );

        } catch (AuthenticationException e) {
            // 인증 실패 (비밀번호 불일치, 사용자 없음 등)
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }
}