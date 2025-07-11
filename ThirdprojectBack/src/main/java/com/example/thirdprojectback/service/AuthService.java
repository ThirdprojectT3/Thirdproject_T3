package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.LoginRequest;
import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.SignupResponse;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
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
@Transactional
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /* 회원가입 */
    public SignupResponse register(MemberRequestDto dto) {
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        Member member = Member.builder()
                .email(dto.getEmail())
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .height(dto.getHeight())
                .age(dto.getAge())
                .gender(dto.getGender())
                .goal(dto.getGoal())
                .diseases(dto.getDiseases())
                .build();

        memberRepository.save(member);
        return new SignupResponse("회원가입 성공");
    }

    /* 로그인 인증만 수행 (JWT는 Controller에서 쿠키로 내려줌) */
    public Member authenticate(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );

            return memberRepository.findByEmail(req.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));

        } catch (AuthenticationException ex) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 일치하지 않습니다.");
        }
    }
}
