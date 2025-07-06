package com.example.thirdprojectback.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct; // 주의: javax.였던 것이 jakarta로 변경되었습니다.
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    // application.yml에서 JWT 시크릿 키를 로드합니다. (보안을 위해 강력하고 긴 키 사용 권장)
    @Value("${jwt.secret-key}")
    private String secretKeyString;

    private SecretKey SECRET_KEY;

    // application.yml에서 JWT 만료 시간을 로드합니다. (밀리초 단위)
    @Value("${jwt.expiration-time-ms}")
    private long expirationTimeMs;

    // 생성자 주입 후, @Value로 주입된 값들을 사용하여 SecretKey를 초기화합니다.
    @PostConstruct
    public void init() {
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKeyString.getBytes(StandardCharsets.UTF_8));
    }

    // JWT 토큰 생성 메서드
    public String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeMs);

        return Jwts.builder()
                .setSubject(email) // 토큰의 주체 (여기서는 사용자 이메일)
                .setIssuedAt(now)  // 토큰 발급 시간
                .setExpiration(expiryDate) // 토큰 만료 시간
                .signWith(SECRET_KEY) // 지정된 시크릿 키로 서명
                .compact(); // JWT를 압축하여 문자열로 반환
    }

    // JWT 토큰에서 사용자 이메일(subject)을 추출하는 메서드
    public String getEmailFromToken(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY) // 시크릿 키로 서명 검증
                .build()
                .parseSignedClaims(token) // 토큰 파싱
                .getPayload() // 클레임(payload) 추출
                .getSubject(); // 주체(subject) 반환
    }

    // JWT 토큰의 유효성을 검사하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(SECRET_KEY)
                    .build()
                    .parseSignedClaims(token);
            return true; // 유효한 토큰
        } catch (io.jsonwebtoken.security.SignatureException e) {
            // JWT 서명이 유효하지 않을 때
            System.err.println("잘못된 JWT 서명: " + e.getMessage());
        } catch (MalformedJwtException e) {
            // 구조적으로 잘못된 JWT 토큰일 때
            System.err.println("잘못된 JWT 토큰: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            // 만료된 JWT 토큰일 때
            System.err.println("만료된 JWT 토큰: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            // 지원되지 않는 JWT 토큰일 때
            System.err.println("지원되지 않는 JWT 토큰: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            // JWT 클레임 문자열이 비어있을 때
            System.err.println("JWT 클레임 문자열이 비어있습니다: " + e.getMessage());
        }
        return false; // 유효하지 않은 토큰
    }
}