package com.example.thirdprojectback.service;

import com.example.thirdprojectback.entity.Member;
import com.example.thirdprojectback.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // 권한 부여를 위해 추가
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 이메일(username)로 Member 엔티티를 조회합니다.
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("이메일로 사용자를 찾을 수 없습니다: " + email));

        // Spring Security의 UserDetails 객체를 생성하여 반환합니다.
        // 여기서는 임시로 "ROLE_USER" 권한을 부여합니다.
        // 실제 애플리케이션에서는 Member 엔티티에 역할(Role) 필드를 추가하고, 해당 역할을 기반으로 권한을 부여해야 합니다.
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        // 만약 Member 엔티티에 role 필드가 있다면 아래처럼 사용할 수 있습니다.
        // List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + member.getRole()));

        return new org.springframework.security.core.userdetails.User(
                member.getEmail(),      // 사용자 이름 (여기서는 이메일)
                member.getPassword(),   // 암호화된 비밀번호
                authorities             // 사용자 권한 목록
        );
    }
}