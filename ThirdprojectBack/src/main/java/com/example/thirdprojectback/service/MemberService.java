package com.example.thirdprojectback.service;

import com.example.thirdprojectback.dto.MemberRequestDto;
import com.example.thirdprojectback.dto.MemberResponseDto;
import com.example.thirdprojectback.dto.MemberUpdateDto;
import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // PasswordEncoder 임포트
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 트랜잭션 관리를 위해 추가

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // ✅ 회원 등록
    @Transactional
    public MemberResponseDto createMember(MemberRequestDto dto) {
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        Member member = Member.builder()
                .email(dto.getEmail())
                .name(dto.getName())
                .password(passwordEncoder.encode(dto.getPassword()))
                .height(dto.getHeight())
                .age(dto.getAge())
                .gender(dto.getGender())
                .goal(dto.getGoal())
                .diseases(dto.getDiseases()) // ✅ 추가됨
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

    @Transactional
    public MemberResponseDto updateMember(Long id, MemberUpdateDto dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (dto.getName() != null) member.setName(dto.getName());
        if (dto.getHeight() != null) member.setHeight(dto.getHeight());
        if (dto.getAge() != null) member.setAge(dto.getAge());
        if (dto.getGender() != null) member.setGender(dto.getGender());
        if (dto.getGoal() != null) member.setGoal(dto.getGoal());
        if (dto.getDiseases() != null) member.setDiseases(dto.getDiseases());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            String encoded = passwordEncoder.encode(dto.getPassword());
            member.setPassword(encoded);
        }

        return toDto(member);
    }


    @Transactional
    public MemberResponseDto patchMember(Long id, MemberRequestDto dto) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        if (dto.getName() != null) member.setName(dto.getName());
        if (dto.getHeight() != null) member.setHeight(dto.getHeight());
        if (dto.getAge() != null) member.setAge(dto.getAge());
        if (dto.getGender() != null) member.setGender(dto.getGender());
        if (dto.getGoal() != null) member.setGoal(dto.getGoal());
        if (dto.getDiseases() != null) member.setDiseases(dto.getDiseases());

        return toDto(member);
    }

    // ✅ 전체 회원 조회
    public List<MemberResponseDto> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ✅ 회원 삭제
    @Transactional
    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }
        memberRepository.deleteById(id);
    }

    // ✅ Entity → DTO 변환
    private MemberResponseDto toDto(Member member) {
        return MemberResponseDto.builder()
                .userId(member.getUserId())
                .email(member.getEmail())
                .name(member.getName())
                .height(member.getHeight())
                .age(member.getAge())
                .gender(member.getGender())
                .goal(member.getGoal())
                .diseases(member.getDiseases()) // ✅ 추가됨
                .build();
    }
}
