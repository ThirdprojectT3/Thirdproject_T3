package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.MemberResponseDto;
import com.example.thirdprojectback.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members") // 이제 이 컨트롤러는 일반적인 회원 관리 기능만 담당합니다.
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // ✅ 회원 등록 (POST) - AuthController로 이동했지만, MemberService의 기본적인 createMember는 유지
    // 이 엔드포인트는 SecurityConfig에서 permitAll 되어야 함.
    @PostMapping("/register") // 회원가입 엔드포인트를 명확히 분리
    public ResponseEntity<MemberResponseDto> createMember(@RequestBody MemberRequestDto dto) {
        // 이 부분은 AuthService로 로직이 이동했지만, MemberController에 남아있다면 이메일 중복 체크 등을 수행해야 합니다.
        // 현재는 AuthService에서 회원가입을 처리하므로, 이 엔드포인트는 실제로 사용되지 않을 수 있습니다.
        // 만약 사용하려면 이메일 중복 및 비밀번호 암호화 로직이 MemberService에 올바르게 구현되어 있어야 합니다.
        MemberResponseDto savedMember = memberService.createMember(dto); // AuthService 대신 MemberService 사용
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMember);
    }

    // ✅ 회원 단건 조회 (GET) - 인증된 사용자만 접근 가능하도록 SecurityConfig에서 설정됨
    @GetMapping("/{id}")
    public ResponseEntity<MemberResponseDto> getMember(@PathVariable Long id) {
        MemberResponseDto member = memberService.getMemberById(id);
        return ResponseEntity.ok(member);
    }

    // ✅ 전체 회원 조회 (GET) - 인증된 사용자만 접근 가능하도록 SecurityConfig에서 설정됨
    @GetMapping
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        List<MemberResponseDto> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    // ✅ (선택) 회원 삭제 - 인증된 사용자만 접근 가능하도록 SecurityConfig에서 설정됨
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id); // MemberService에 deleteMember 메서드가 있다고 가정
        return ResponseEntity.noContent().build();
    }
}