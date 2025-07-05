package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.MemberResponseDto;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // ✅ 회원 등록
    public MemberResponseDto createMember(MemberRequestDto dto) {
        Member member = Member.builder()
                .email(dto.getEmail())
                .name(dto.getName())
                .password(dto.getPassword()) // 실제 서비스에선 암호화 필요
                .height(dto.getHeight())
                .age(dto.getAge())
                .gender(dto.getGender())
                .goal(dto.getGoal())
                .build();

        Member saved = memberRepository.save(member);
        return toDto(saved);
    }

    // ✅ 회원 단건 조회
    public MemberResponseDto getMemberById(Long userId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        return toDto(member);
    }

    // ✅ 전체 회원 조회
    public List<MemberResponseDto> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ✅ Entity → DTO 변환 메서드
    private MemberResponseDto toDto(Member member) {
        return MemberResponseDto.builder()
                .userId(member.getUserId())
                .email(member.getEmail())
                .name(member.getName())
                .height(member.getHeight())
                .age(member.getAge())
                .gender(member.getGender())
                .goal(member.getGoal())
                .build();
    }
}
