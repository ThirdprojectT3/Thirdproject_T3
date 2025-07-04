package com.example.thirdprojectback.controller;

import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.MemberResponseDto;
import com.example.thirdprojectback.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // ✅ 회원 등록 (POST)
    @PostMapping
    public ResponseEntity<MemberResponseDto> createMember(@RequestBody MemberRequestDto dto) {
        MemberResponseDto savedMember = memberService.createMember(dto);
        return ResponseEntity.ok(savedMember);
    }

    // ✅ 회원 단건 조회 (GET)
    @GetMapping("/{id}")
    public ResponseEntity<MemberResponseDto> getMember(@PathVariable Long id) {
        MemberResponseDto member = memberService.getMemberById(id);
        return ResponseEntity.ok(member);
    }

    // ✅ 전체 회원 조회 (GET)
    @GetMapping
    public ResponseEntity<List<MemberResponseDto>> getAllMembers() {
        List<MemberResponseDto> members = memberService.getAllMembers();
        return ResponseEntity.ok(members);
    }

    // ✅ (선택) 회원 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        // service에 deleteMember 메서드가 있다고 가정
        // memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}
